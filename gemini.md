# Slip Generation Website Plan

This document outlines the plan for creating the insurance slip generation website.

## 1. Dependencies

- Install `docx` for generating Word documents.
- Install `file-saver` for saving the generated file on the client's machine.
- Install `@types/file-saver` for TypeScript support.

## 2. Data Structure

- Define a clear data structure for the insurance clauses, including their titles, text, and the dynamic variables (like excess amounts) they contain.
- Create a sample set of clauses to work with.

## 3. UI Components

- **`TermsSelector`:** A sidebar component to display the list of available insurance clauses that the user can add to the slip.
- **`SlipPreview`:** The main area that displays the slip. It will show the generic fields and the clauses selected by the user, along with input fields for the dynamic variables.
- **`SlipBuilder`:** A parent component to manage the overall state, including which clauses are selected and the values of their variables.

## 4. Core Logic

- Handle the state management, allowing users to add/remove clauses and update the variable fields, with the `SlipPreview` updating in real-time.

## 5. Export Functionality

- Implement the "Export to Word" feature, which will take the current state of the slip, generate a `.docx` file using the `docx` library, and trigger a download.
