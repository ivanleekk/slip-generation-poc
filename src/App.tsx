// src/App.tsx
import { Box, VStack, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { GeneralInfo } from "@/components/generalInfo"; // Assuming correct path
import { CoverageEditor, type CoverageSectionData } from "@/components/coverageEditor"; // Assuming correct path, import CoverageSectionData
import { Toaster, toaster } from "@/components/ui/toaster"

// docxtemplater imports
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

function App() {

    // State for GeneralInfo
    const [generalInfo, setGeneralInfo] = useState({
        classOfInsurance: '',
        policyForm: '',
        insuredName: '',
        correspondenceAddress: '',
        business: '',
        periodOfInsurance: '',
    });

    // State for CoverageEditor
    const [coverageSections, setCoverageSections] = useState<CoverageSectionData[]>([]);

    // Handler for GeneralInfo field changes
    const handleGeneralInfoChange = (field: string, value: string) => {
        setGeneralInfo((prev) => ({ ...prev, [field]: value }));
    };

    const generateWordDoc = async () => {
        try {
            // 1. Fetch the template
            // Ensure 'template.docx' is in your 'public' folder
            const response = await fetch('/slip_template.docx.docx');
            if (!response.ok) {
                throw new Error(`Failed to fetch template: ${response.statusText}. Ensure 'template.docx' is in your public folder.`);
            }
            const templateBlob = await response.blob();
            const reader = new FileReader();

            reader.onload = async function (event) {
                if (event.target && event.target.result) {
                    const content = event.target.result as ArrayBuffer;
                    const zip = new PizZip(content);
                    const doc = new Docxtemplater(zip, {
                        paragraphLoop: true,
                        linebreaks: true,
                    });

                    // 2. Prepare the data for the template
                    // Ensure your data structure matches your template placeholders
                    const data = {
                        refNo: 'IAR/PS-XXXX', // Example static data or get from state if available
                        currentDate: new Date().toLocaleDateString('en-US'), // Example static data
                        ...generalInfo, // Spread generalInfo state
                        sections: coverageSections.map(section => ({
                            title: section.title,
                            content: section.content,
                            // Ensure 'clauses' array items match what your template expects.
                            // If your template expects a simple list of strings, you might do:
                            // clauses: section.clauses.map(clause => clause.description)
                            // If it expects objects with a 'description' field (as suggested in the template example):
                            clauses: section.clauses.map(clause => ({ description: clause.description }))
                        })),
                    };

                    // console.log("Data for docxtemplater:", data); // Uncomment for debugging data structure

                    // 3. Set the data and render the document
                    doc.setData(data);
                    doc.render();

                    // 4. Generate the output Word document
                    const out = doc.getZip().generate({
                        type: 'blob',
                        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        compression: 'DEFLATE',
                    });

                    // 5. Save the document
                    saveAs(out, 'Generated_Document.docx');
                    toaster.create({
                        title: "Word document generated.",
                        description: "Your .docx file has been downloaded.",
                        type: "success",
                        duration: 5000,
                        closable: true,
                    });
                }
            };

            reader.readAsArrayBuffer(templateBlob);

        } catch (error) {
            console.error('Error generating Word document:', error);
            toaster.create({
                title: "Error generating Word document.",
                description: (error instanceof Error) ? error.message : "An unknown error occurred.",
                type: "error",
                duration: 9000,
                closable: true,
            })
        }
    };

    return (
        <Box className='h-dvh w-dvw p-4 flex flex-col items-center'> {/* Use Box for Chakra styling */}
            <Button onClick={generateWordDoc} variant={'subtle'}>
                Generate Word Document (.docx)
            </Button>

            {/* General Info component, receiving state and update handler */}
            <GeneralInfo
                {...generalInfo} // Pass all generalInfo fields as props
                onFieldChange={handleGeneralInfoChange}
            />

            {/* Coverage Editor component, receiving state and its setter */}
            <CoverageEditor
                sections={coverageSections}
                setSections={setCoverageSections}
            />
            <Toaster />

        </Box>
    );
}

export default App;