
import React, { useState } from 'react';
import { TermsSelector } from './terms-selector';
import { SlipPreview } from './slip-preview';
import { CLAUSES_DATA, Clause, initialVariables } from '../data/clauses';

export const SlipBuilder: React.FC = () => {
  const [selectedClauses, setSelectedClauses] = useState<Clause[]>([]);
  const [variables, setVariables] = useState(initialVariables);

  const handleSelectClause = (clauseData: Omit<Clause, 'variables'>) => {
    const newClause: Clause = {
        ...clauseData,
        variables: variables[clauseData.id],
    };
    setSelectedClauses((prev) => [...prev, newClause]);
  };

  const handleRemoveClause = (clauseId: string) => {
    setSelectedClauses((prev) => prev.filter((c) => c.id !== clauseId));
  };

  const handleVariableChange = (clauseId: string, variableId: string, value: string | number) => {
    setVariables(prev => ({
        ...prev,
        [clauseId]: {
            ...prev[clauseId],
            [variableId]: {
                ...prev[clauseId][variableId],
                value
            }
        }
    }));

    setSelectedClauses(prev => prev.map(clause => {
        if (clause.id === clauseId) {
            return {
                ...clause,
                variables: {
                    ...clause.variables,
                    [variableId]: {
                        ...clause.variables[variableId],
                        value
                    }
                }
            }
        }
        return clause;
    }));
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 border-r">
        <TermsSelector
          clauses={CLAUSES_DATA}
          selectedClauses={selectedClauses}
          onSelectClause={handleSelectClause}
          onRemoveClause={handleRemoveClause}
        />
      </div>
      <div className="w-3/4 p-4">
        <SlipPreview 
            selectedClauses={selectedClauses} 
            onVariableChange={handleVariableChange} 
        />
      </div>
    </div>
  );
};
