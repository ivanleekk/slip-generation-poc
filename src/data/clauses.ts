
export interface ClauseVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'currency';
  value: string | number;
}

export interface Clause {
  id: string;
  name: string;
  text: (variables: Record<string, ClauseVariable>) => string;
  variables: Record<string, ClauseVariable>;
}

export const CLAUSES_DATA: Omit<Clause, 'variables'>[] = [
  {
    id: 'CGL',
    name: 'Commercial General Liability',
    text: (vars) => `This policy provides Commercial General Liability coverage with a limit of ${vars.limit.value} per occurrence and ${vars.aggregate.value} in the aggregate. The policy covers bodily injury and property damage arising out of the insured's operations. A deductible of ${vars.deductible.value} applies to each claim.`,
  },
  {
    id: 'PROP',
    name: 'Property Coverage',
    text: (vars) => `This policy covers the insured's property located at ${vars.location.value} against all risks of direct physical loss or damage, subject to a limit of ${vars.limit.value}. A co-insurance penalty of ${vars.coinsurance.value}% applies. The valuation method is ${vars.valuation.value}.`,
  },
  {
    id: 'CYBER',
    name: 'Cyber Liability',
    text: (vars) => `This policy covers losses resulting from data breaches and other cyber security incidents. The limit of liability is ${vars.limit.value}. The policy includes coverage for forensic investigation, notification costs, and credit monitoring services. The retention amount is ${vars.retention.value}.`,
  },
  {
    id: 'WC',
    name: 'Workers Compensation',
    text: (vars) => `This policy provides Workers' Compensation and Employers' Liability coverage as required by the laws of the state of ${vars.state.value}. Coverage A is statutory. Coverage B, Employers' Liability, has limits of ${vars.limitEL.value} each accident, ${vars.limitDisease.value} disease-policy limit, and ${vars.limitDiseaseEach.value} disease-each employee.`,
  },
];

export const CLAUSE_VARIABLES: Record<string, Record<string, Omit<ClauseVariable, 'value'>>> = {
    CGL: {
        limit: { id: 'limit', name: 'Per Occurrence Limit', type: 'currency' },
        aggregate: { id: 'aggregate', name: 'Aggregate Limit', type: 'currency' },
        deductible: { id: 'deductible', name: 'Deductible', type: 'currency' },
    },
    PROP: {
        location: { id: 'location', name: 'Property Location', type: 'text' },
        limit: { id: 'limit', name: 'Property Limit', type: 'currency' },
        coinsurance: { id: 'coinsurance', name: 'Co-insurance %', type: 'number' },
        valuation: { id: 'valuation', name: 'Valuation Method', type: 'text' },
    },
    CYBER: {
        limit: { id: 'limit', name: 'Limit of Liability', type: 'currency' },
        retention: { id: 'retention', name: 'Retention', type: 'currency' },
    },
    WC: {
        state: { id: 'state', name: 'State', type: 'text' },
        limitEL: { id: 'limitEL', name: 'EL Each Accident', type: 'currency' },
        limitDisease: { id: 'limitDisease', name: 'EL Disease - Policy Limit', type: 'currency' },
        limitDiseaseEach: { id: 'limitDiseaseEach', name: 'EL Disease - Each Employee', type: 'currency' },
    }
};

export const initialVariables: Record<string, Record<string, ClauseVariable>> = Object.entries(CLAUSE_VARIABLES).reduce((acc, [clauseId, vars]) => {
    acc[clauseId] = Object.entries(vars).reduce((varAcc, [varId, varDetails]) => {
        varAcc[varId] = { ...varDetails, value: '' };
        return varAcc;
    }, {} as Record<string, ClauseVariable>);
    return acc;
}, {} as Record<string, Record<string, ClauseVariable>>);
