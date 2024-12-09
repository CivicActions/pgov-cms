export interface NodeGoalProps {
  title: string,
  body: {
    value: string
  },
  path: string,
  topics: [
    {
      id: string,
      name: string,
    }
  ],
}

export interface ViewFilter {
  options: Object,
  value: any
}
