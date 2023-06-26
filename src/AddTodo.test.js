import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component doesn't render dupicate Task", async () => {
  render(<App />);
  //grab necessary elements
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDueDate = screen.getByRole("textbox", { name: /Due Date/i });
  const button = screen.getByRole("button", { name: /Add/i });

  //add a task
  fireEvent.change(inputTask, { target: { value: "Task 1" } });
  fireEvent.change(inputDueDate, { target: { value: "6/27/2023" } });
  fireEvent.click(button);

  //try to add a duplicate task
  fireEvent.change(inputTask, { target: { value: "Task 1" } });
  fireEvent.change(inputDueDate, { target: { value: "6/27/2023" } });
  fireEvent.click(button);

  //check that only one task is added
  const items = await screen.findAllByText("Task 1");
  expect(items.length).toBe(1);
});

test("test that App component doesn't add a task without task name", () => {
  render(<App />);

  //grab necessary elements
  const inputDueDate = screen.getByRole("textbox", { name: /Due Date/i });
  const button = screen.getByRole("button", { name: /Add/i });

  //try to add a task without task name
  fireEvent.change(inputDueDate, { target: { value: "6/27/2023" } });
  fireEvent.click(button);

  //check that no task is added
  const correctVal = screen.getByText("You have no todo's left");
  expect(correctVal).toBeInTheDocument();
});

test("test that App component doesn't add a task without due date", () => {
  render(<App />);

  //grab necessary elements
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const button = screen.getByRole("button", { name: /Add/i });

  //try to add a task without due date
  fireEvent.change(inputTask, { target: { value: "Task 1" } });
  fireEvent.click(button);

  //check that no task is added
  const correctVal = screen.getByText("You have no todo's left");
  expect(correctVal).toBeInTheDocument();
});

test("test that App component can be deleted thru checkbox", () => {
  render(<App />);

  //grab necessary elements
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDueDate = screen.getByRole("textbox", { name: /Due Date/i });
  const button = screen.getByRole("button", { name: /Add/i });

  //add a task
  fireEvent.change(inputTask, { target: { value: "Task 1" } });
  fireEvent.change(inputDueDate, { target: { value: "6/27/2023" } });
  fireEvent.click(button);

  //delete the task
  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);
  //check that it got deleted
  const correctVal = screen.getByText("You have no todo's left");
  expect(correctVal).toBeInTheDocument();
});

test("test that App component renders different colors for past due events", () => {
  render(<App />);

  //grab necessary elements
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDueDate = screen.getByRole("textbox", { name: /Due Date/i });
  const button = screen.getByRole("button", { name: /Add/i });

  //add a task that is past due
  fireEvent.change(inputTask, { target: { value: "Task 1" } });
  fireEvent.change(inputDueDate, { target: { value: "6/20/2023" } });
  fireEvent.click(button);

  //check that past due task is not white
  const pastDueChecker = screen.getByTestId(/Task 1/i).style.background;
  expect(pastDueChecker).not.toBe("white");
});
