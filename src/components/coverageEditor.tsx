import React from 'react';
import {
    Box,
    Button,
    Field,
    Input,
    Textarea,
    VStack,
    HStack,
    IconButton,
    Heading,
    Text,
} from '@chakra-ui/react';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Using react-icons

// Define types for better code clarity, export them for App.tsx
export interface Clause {
    id: string; // Keep ID for React keys, but not necessarily for docxtemplater data
    description: string;
}

export interface CoverageSectionData {
    id: string; // Keep ID for React keys, but not necessarily for docxtemplater data
    title: string;
    content: string; // The main description paragraph for the section
    sumInsured: number;
    indemnityPeriod: string;
    totalSumInsured?: number; // Optional, can be calculated if needed
    clauses: Clause[]; // The numbered list items within the section
}

interface CoverageEditorProps {
    sections: CoverageSectionData[];
    setSections: React.Dispatch<React.SetStateAction<CoverageSectionData[]>>;
}

export function CoverageEditor({ sections, setSections }: CoverageEditorProps) {

    const addSection = () => {
        setSections((prevSections) => [
            ...prevSections,
            {
                id: crypto.randomUUID(), // Unique ID for React keying
                title: '',
                content: '',
                sumInsured: 0,
                indemnityPeriod: '',
                clauses: [],
            },
        ]);
    };

    const removeSection = (id: string) => {
        setSections((prevSections) => prevSections.filter((section) => section.id !== id));
    };

    const updateSectionTitle = (id: string, newTitle: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === id ? { ...section, title: newTitle } : section
            )
        );
    };

    const updateSectionContent = (id: string, newContent: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === id ? { ...section, content: newContent } : section
            )
        );
    };

    const updateSectionSumInsured = (id: string, newSumInsured: number) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === id ? { ...section, sumInsured: newSumInsured } : section
            )
        );
    };

    const updateSectionIndemnityPeriod = (id: string, newIndemnityPeriod: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === id ? { ...section, indemnityPeriod: newIndemnityPeriod } : section
            )
        );
    };

    const addClause = (sectionId: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        clauses: [
                            ...section.clauses,
                            { id: crypto.randomUUID(), description: '' }, // Unique ID for React keying
                        ],
                    }
                    : section
            )
        );
    };

    const removeClause = (sectionId: string, clauseId: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        clauses: section.clauses.filter((clause) => clause.id !== clauseId),
                    }
                    : section
            )
        );
    };

    const updateClauseDescription = (
        sectionId: string,
        clauseId: string,
        newDescription: string
    ) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        clauses: section.clauses.map((clause) =>
                            clause.id === clauseId
                                ? { ...clause, description: newDescription }
                                : clause
                        ),
                    }
                    : section
            )
        );
    };

    return (
        <VStack align="stretch" className="w-full max-w-2xl mx-auto p-4">
            <Heading as="h2" size="lg" mb={4}>Coverage Details</Heading>

            {sections.map((section, sectionIndex) => (
                <Box key={section.id} p={4} borderWidth="1px" borderRadius="lg" shadow="md">
                    <HStack justifyContent="space-between" alignItems="center" mb={4}>
                        <Heading as="h3" size="md">Section {sectionIndex + 1}</Heading>
                        <IconButton
                            aria-label="Remove section"
                            onClick={() => removeSection(section.id)}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                        ><FaTrash /></IconButton>
                    </HStack>

                    <Field.Root mb={4}>
                        <Field.Label>Section Title</Field.Label>
                        <Input
                            placeholder="e.g., Section I - (a) Utilities All Risk of Physical Loss or Damage"
                            value={section.title}
                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        />
                    </Field.Root>

                    <Field.Root mb={4}>
                        <Field.Label>Section Content (Main Description)</Field.Label>
                        <Textarea
                            placeholder="Enter the main description paragraph for this section."
                            value={section.content}
                            onChange={(e) => updateSectionContent(section.id, e.target.value)}
                            minH="100px"
                        />
                    </Field.Root>

                    <Field.Root mb={4}>
                        <Field.Label>Sum Insured</Field.Label>
                        <Input
                            placeholder="e.g., S$1,000,000"
                            value={section.sumInsured}
                            type="number"
                            onChange={(e) => updateSectionSumInsured(section.id, e.target.value)}
                        />
                    </Field.Root>

                    <Field.Root mb={4}>
                        <Field.Label>Indemnity Period</Field.Label>
                        <Input
                            placeholder="e.g., 12 months"
                            value={section.indemnityPeriod}
                            onChange={(e) => updateSectionIndemnityPeriod(section.id, e.target.value)}
                        />
                    </Field.Root>

                    <VStack align="stretch" pl={4} mt={4} borderLeft="2px solid" borderColor="gray.200">
                        <Text fontWeight="semibold" mb={2}>Clauses:</Text>
                        {section.clauses.map((clause, clauseIndex) => (
                            <HStack key={clause.id} >
                                <Text fontSize="sm">{clauseIndex + 1}.</Text>
                                <Field.Root flex={1}>
                                    <Field.Label srOnly>{`Clause ${clauseIndex + 1} Description`}</Field.Label>
                                    <Input
                                        placeholder={`Clause ${clauseIndex + 1} description`}
                                        value={clause.description}
                                        onChange={(e) =>
                                            updateClauseDescription(
                                                section.id,
                                                clause.id,
                                                e.target.value
                                            )
                                        }
                                        size="sm"
                                    />
                                </Field.Root>
                                <IconButton
                                    aria-label="Remove clause"
                                    onClick={() => removeClause(section.id, clause.id)}
                                    size="xs"
                                    colorScheme="red"
                                    variant="ghost"
                                ><FaTrash /></IconButton>
                            </HStack>
                        ))}
                        <Button
                            onClick={() => addClause(section.id)}
                            variant="outline"
                            size="sm"
                            mt={2}
                        >
                            Add Clause
                        </Button>
                    </VStack>
                </Box>
            ))}

            <Button onClick={addSection} variant={'subtle'} >
                Add New Coverage Section
            </Button>
        </VStack>
    );
}