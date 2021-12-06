import { LightningElement, api, track } from "lwc";

const MENU_OPTIONS = [
  {
    name: "Exam",
    options: [
      {
        label: "Exam 1",
        value: "00001",
        subtitle: "Status: Auto • Examinee Access: Upload • Client Access: View",
        fields: [
          {
            label: "Status:",
            value: "Auto",
          },
          {
            label: "Examinee Access:",
            value: "Upload",
          },
          {
            label: "Client Access:",
            value: "View",
          },
        ],
      },
      {
        label: "Exam 2",
        value: "00002",
        subtitle: "Status: Auto • Examinee Access: Upload • Client Access: View",
      },
    ],
  },
  {
    name: "Exam Paperwork",
    options: [
      {
        label: "Exam Paperwork 1",
        value: "00003",
        subtitle: "Status: Auto • Examinee Access: Upload • Client Access: View",
        fields: [
          {
            label: "Status:",
            value: "Auto",
          },
          {
            label: "Examinee Access:",
            value: "Upload",
          },
          {
            label: "Client Access:",
            value: "View",
          },
        ],
      },
      {
        label: "Exam Paperwork 2",
        value: "00004",
        subtitle: "Status: Auto • Examinee Access: Upload • Client Access: View",
        fields: [
          {
            label: "Status:",
            value: "Auto",
          },
          {
            label: "Examinee Access:",
            value: "Upload",
          },
          {
            label: "Client Access:",
            value: "View",
          },
        ],
      },
    ],
  },
  {
    name: "Other",
    options: [
      {
        label: "Other 1",
        value: "00005",
        subtitle: "Status: Auto • Examinee Access: Upload • Client Access: View",
        fields: [
          {
            label: "Status:",
            value: "Auto",
          },
          {
            label: "Examinee Access:",
            value: "Upload",
          },
          {
            label: "Client Access:",
            value: "View",
          },
        ],
      },
      {
        label: "Other 2",
        value: "00006",
        subtitle: "Status: Auto • Examinee Access: Upload • Client Access: View",
        fields: [
          {
            label: "Status:",
            value: "Auto",
          },
          {
            label: "Examinee Access:",
            value: "Upload",
          },
          {
            label: "Client Access:",
            value: "View",
          },
        ],
      },
    ],
  },
];

export default class App extends LightningElement {
  placeholder = "Select Document Type";
  label = "Care Program Document Types";
  menuOptions = MENU_OPTIONS;
  selectedValue;

  handleSelect(event) {
    this.selectionValue = event.detail;
  }
}
