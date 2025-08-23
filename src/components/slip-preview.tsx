
import React from 'react';
import { Clause } from '../data/clauses';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface SlipPreviewProps {
  selectedClauses: Clause[];
  onVariableChange: (clauseId: string, variableId: string, value: string | number) => void;
}

export const SlipPreview: React.FC<SlipPreviewProps> = ({ selectedClauses, onVariableChange }) => {
    const [insuredName, setInsuredName] = React.useState('');
    const [policyPeriod, setPolicyPeriod] = React.useState('');
    const [underwriter, setUnderwriter] = React.useState('');
    const [policyNumber, setPolicyNumber] = React.useState('');


  const handleExport = () => {
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Insurance Slip",
                            bold: true,
                            size: 32,
                        }),
                    ],
                    spacing: {
                        after: 200,
                    }
                }),
                new Paragraph({ text: `Insured Name: ${insuredName}` }),
                new Paragraph({ text: `Policy Period: ${policyPeriod}` }),
                new Paragraph({ text: `Underwriter: ${underwriter}` }),
                new Paragraph({ text: `Policy Number: ${policyNumber}` }),
                new Paragraph({ text: "---" }),
                ...selectedClauses.flatMap(clause => [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: clause.name,
                                bold: true,
                                size: 24,
                            }),
                        ],
                        spacing: {
                            before: 200,
                            after: 100,
                        }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: clause.text(clause.variables),
                            }),
                        ],
                    }),
                ])
            ],
        }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'insurance-slip.docx');
    });
  };

  return (
    <div>
        <div className='flex justify-between items-center'>
            <h2 className="text-2xl font-bold mb-4">Insurance Slip</h2>
            <Button onClick={handleExport}>Export to Word</Button>
        </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <Label htmlFor="insured-name">Insured Name</Label>
          <Input id="insured-name" placeholder="Enter insured name" value={insuredName} onChange={e => setInsuredName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="policy-period">Policy Period</Label>
          <Input id="policy-period" placeholder="Enter policy period" value={policyPeriod} onChange={e => setPolicyPeriod(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="underwriter">Underwriter</Label>
          <Input id="underwriter" placeholder="Enter underwriter name" value={underwriter} onChange={e => setUnderwriter(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="policy-number">Policy Number</Label>
          <Input id="policy-number" placeholder="Enter policy number" value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} />
        </div>
      </div>

      <Separator />

      {selectedClauses.length > 0 ? (
        selectedClauses.map((clause) => (
          <div key={clause.id} className="my-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{clause.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{clause.text(clause.variables)}</p>
            <div className="grid grid-cols-2 gap-4">
              {Object.values(clause.variables).map((variable) => (
                <div key={variable.id}>
                  <Label htmlFor={`${clause.id}-${variable.id}`}>{variable.name}</Label>
                  <Input
                    id={`${clause.id}-${variable.id}`}
                    type={variable.type === 'currency' ? 'text' : variable.type}
                    value={variable.value}
                    onChange={(e) => onVariableChange(clause.id, variable.id, e.target.value)}
                    placeholder={`Enter ${variable.name}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )) 
      ) : (
        <div className="text-center py-12">
            <p className='text-lg font-semibold'>No clauses selected</p>
            <p className='text-sm text-gray-500'>Please select clauses from the left panel to build the slip.</p>
        </div>
      )}
    </div>
  );
};
