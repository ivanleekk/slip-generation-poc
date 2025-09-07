import React, { useState } from "react";
import OpenAI from "openai";
import { Button, Input, InputGroup, CloseButton, FileUpload } from "@chakra-ui/react";
import { LuFileUp } from "react-icons/lu";


interface EmailUploaderProps {
    setGeneralInfo: (info: any) => void;
    setCoverageSections: (sections: any[]) => void;
    generalInfo: any;
    coverageSections: any[];
}

export default function EmailUploader({ setGeneralInfo, setCoverageSections, generalInfo, coverageSections }: EmailUploaderProps) {
    const [combinedText, setCombinedText] = useState("");

    async function handleFiles(files: FileList | null) {
        if (!files) return;
        const all_texts: string[] = [];
        for (const f of Array.from(files)) {
            try {
                const text = await f.text();
                all_texts.push(text);
            } catch (e) {
                console.warn("Failed to read file", f.name, e);
            }
        }
        setCombinedText(all_texts.join("\n\n---EMAIL BREAK---\n\n"));
    }

    function clearText() {
        setCombinedText("");
    }


    async function callOpenAI(message: string) {
        const client = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            baseURL: "http://localhost:8080/v1",
            dangerouslyAllowBrowser: true,
        });
        const systemPrompt = `You are a helpful assistant that extracts insurance slip data from emails. Do not think for too long. \nOutput ONLY valid JSON with the following structure:\n\n{\n  "generalInfo": {\n    "classOfInsurance": "",\n    "policyForm": "",\n    "insuredName": "",\n    "correspondenceAddress": "",\n    "business": "",\n    "periodOfInsurance": ""\n  },\n  "coverageSections": [\n    {\n      "title": "",\n      "content": "",\n      "clauses": [{ "description": "" }],\n      "sumInsured": "",\n      "indemnityPeriod": ""\n    }\n  ]\n}\n\nExtract the information from the provided email(s) and fill in the fields. If a field is missing, leave it as an empty string. Do not include any commentary or markdown, only output the JSON.`;
        const completion = await client.chat.completions.create({
            model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });
        const llmText = completion.choices[0].message.content || "";
        try {
            const parsed = cleanAndParseLLMOutput(llmText);
            setGeneralInfo(parsed.generalInfo || {});
            // Ensure each section has a unique id and sumInsured is a number
            const sections = (parsed.coverageSections || []).map((section: any) => ({
                ...section,
                id: crypto.randomUUID(),
                sumInsured: section.sumInsured ? Number(section.sumInsured) : 0,
            }));
            setCoverageSections(sections);
            console.log("Parsed LLM output:", parsed);
        } catch (e) {
            console.error("Failed to parse LLM output:", e, llmText);
        }
    }


    // Cleans LLM output: removes <think>...</think> and extracts the first JSON object only
    function cleanAndParseLLMOutput(text: string) {
        // Remove <think>...</think> blocks (greedy, multiline)
        let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
        // Find the first JSON object
        const match = cleaned.match(/{[\s\S]*}/);
        if (!match) throw new Error("No JSON found in LLM output");
        try {
            return JSON.parse(match[0]);
        } catch (e) {
            throw new Error("Failed to parse JSON: " + e);
        }
    }

    return (
        <div className="gap-4 w-lg whitespace-pre-wrap text-wrap">
            <h3>Email Uploader (All as One Text)</h3>
            <FileUpload.Root gap="1" maxWidth="300px">
                <FileUpload.HiddenInput accept=".eml,text/plain" multiple onChange={e => handleFiles(e.target.files)} />
                <FileUpload.Label>Upload file</FileUpload.Label>
                <InputGroup
                    startElement={<LuFileUp />}
                    endElement={
                        <FileUpload.ClearTrigger asChild>
                            <CloseButton
                                me="-1"
                                size="xs"
                                variant="plain"
                                focusVisibleRing="inside"
                                focusRingWidth="2px"
                                pointerEvents="auto"
                            />
                        </FileUpload.ClearTrigger>
                    }
                >
                    <Input asChild>
                        <FileUpload.Trigger>
                            <FileUpload.FileText lineClamp={1} />
                        </FileUpload.Trigger>
                    </Input>
                </InputGroup>
            </FileUpload.Root>
            <Button onClick={clearText} style={{ marginLeft: 8 }}>
                Clear
            </Button>
            <Button onClick={() => callOpenAI(combinedText)} disabled={!combinedText}>
                Call OpenAI
            </Button>
            <div style={{ marginBottom: 12 }}>
                <strong>Combined email text:</strong>
                <div >
                    {combinedText || <span style={{ color: '#aaa' }}>[No emails uploaded]</span>}
                </div>
            </div>
            <div style={{ marginBottom: 12 }}>
                <strong>Extracted General Info:</strong>
                <pre className="text-wrap">{JSON.stringify(generalInfo, null, 2)}</pre>
            </div>
            <div style={{ marginBottom: 12 }}>
                <strong>Extracted Coverage Sections:</strong>
                <pre className="text-wrap">{JSON.stringify(coverageSections, null, 2)}</pre>
            </div>
        </div>
    );
}