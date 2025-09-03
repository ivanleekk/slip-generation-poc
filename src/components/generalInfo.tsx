// src/GeneralInfo.tsx
import { Field, Input } from "@chakra-ui/react";

// Define props interface for GeneralInfo
interface GeneralInfoProps {
    classOfInsurance: string;
    policyForm: string;
    insuredName: string;
    correspondenceAddress: string;
    business: string;
    periodOfInsurance: string;
    onFieldChange: (field: string, value: string) => void;
}

export function GeneralInfo({
    classOfInsurance,
    policyForm,
    insuredName,
    correspondenceAddress,
    business,
    periodOfInsurance,
    onFieldChange,
}: GeneralInfoProps) {
    return (
        <div className="w-full max-w-2xl flex flex-col gap-4 p-4">
            <Field.Root>
                <Field.Label>Class of Insurance</Field.Label>
                <Input
                    placeholder="Input"
                    value={classOfInsurance}
                    onChange={(e) => onFieldChange('classOfInsurance', e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Policy Form</Field.Label>
                <Input
                    placeholder="Input"
                    value={policyForm}
                    onChange={(e) => onFieldChange('policyForm', e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Insured Name</Field.Label>
                <Input
                    placeholder="Input"
                    value={insuredName}
                    onChange={(e) => onFieldChange('insuredName', e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Correspondence Address</Field.Label>
                <Input
                    placeholder="Input"
                    value={correspondenceAddress}
                    onChange={(e) => onFieldChange('correspondenceAddress', e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Business</Field.Label>
                <Input
                    placeholder="Input"
                    value={business}
                    onChange={(e) => onFieldChange('business', e.target.value)}
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>Period of Insurance</Field.Label>
                <Input
                    placeholder="Input"
                    value={periodOfInsurance}
                    onChange={(e) => onFieldChange('periodOfInsurance', e.target.value)}
                />
            </Field.Root>
        </div>
    );
}