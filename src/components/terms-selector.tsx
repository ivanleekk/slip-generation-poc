
import React from 'react';
import { Button } from './ui/button';
import { Clause } from '../data/clauses';

interface TermsSelectorProps {
  clauses: Omit<Clause, 'variables'>[];
  selectedClauses: Clause[];
  onSelectClause: (clause: Omit<Clause, 'variables'>) => void;
  onRemoveClause: (clauseId: string) => void;
}

export const TermsSelector: React.FC<TermsSelectorProps> = ({ clauses, selectedClauses, onSelectClause, onRemoveClause }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Available Clauses</h2>
      <ul>
        {clauses.map((clause) => {
          const isSelected = selectedClauses.some((c) => c.id === clause.id);
          return (
            <li key={clause.id} className="flex justify-between items-center mb-2">
              <span>{clause.name}</span>
              <Button
                onClick={() => (isSelected ? onRemoveClause(clause.id) : onSelectClause(clause))}
                variant={isSelected ? 'destructive' : 'outline'}
              >
                {isSelected ? 'Remove' : 'Add'}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
