export const boardData = {
  boardTitle: 'Product roadmap',
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      cards: [
        {
          id: 'user-interviews',
          title: 'User Interviews',
          description: 'Conduct six discovery interviews with five potential target users.',
          tags: [{ label: 'RESEARCH', tone: 'green' }],
          dueDate: '2026-10-28',
          commentList: [
            {
              id: 'ui-c1',
              author: 'James Martin',
              text: 'I already scheduled two interviews for Tuesday and shared the calendar invite.',
            },
            {
              id: 'ui-c2',
              author: 'Amy Diaz',
              text: 'Please add at least one startup founder to balance the participant mix.',
            },
            {
              id: 'ui-c3',
              author: 'Ryan Knight',
              text: 'I can take notes live during the first two sessions.',
            },
            {
              id: 'ui-c4',
              author: 'Luca Cole',
              text: 'Could we add one enterprise user to test advanced workflow assumptions?',
            },
            {
              id: 'ui-c5',
              author: 'Tina Evans',
              text: 'Interview script v2 is in the shared docs folder for review.',
            },
          ],
          assignees: [
            {
              id: 'james',
              name: 'James Martin',
              avatar: 'https://i.pravatar.cc/40?img=12',
            },
          ],
          checklist: [
            { id: 'ui-t1', text: 'Recruit participants', completed: true },
            { id: 'ui-t2', text: 'Finalize interview script', completed: false },
            { id: 'ui-t3', text: 'Run six sessions', completed: false },
            { id: 'ui-t4', text: 'Synthesize findings', completed: false },
            { id: 'ui-t5', text: 'Share readout with stakeholders', completed: false },
          ],
        },
        {
          id: 'competitor-analysis',
          title: 'Competitor Analysis',
          description: 'Review top 3 competitors and document feature parity.',
          tags: [
            { label: 'RESEARCH', tone: 'green' },
            { label: 'DESIGN', tone: 'purple' },
          ],
          dueDate: '2026-10-25',
          commentList: [
            {
              id: 'ca-c1',
              author: 'Ryan Knight',
              text: 'I added a pricing comparison sheet for Notion, Jira, and ClickUp.',
            },
            {
              id: 'ca-c2',
              author: 'Amy Diaz',
              text: 'Feature parity section still needs mobile workflow screenshots.',
            },
            {
              id: 'ca-c3',
              author: 'James Martin',
              text: 'Added a final recommendation section with tradeoffs per competitor.',
            },
          ],
          assignees: [
            {
              id: 'amy',
              name: 'Amy Diaz',
              avatar: 'https://i.pravatar.cc/40?img=47',
            },
            {
              id: 'ryan',
              name: 'Ryan Knight',
              avatar: 'https://i.pravatar.cc/40?img=31',
            },
          ],
          checklist: [
            { id: 'ca-t1', text: 'Capture pricing & plans', completed: true },
            { id: 'ca-t2', text: 'Document feature matrix', completed: true },
            { id: 'ca-t3', text: 'Publish summary deck', completed: false },
          ],
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        {
          id: 'database-schema',
          title: 'Database Schema',
          description: 'Design the core database architecture for the new Kanban module.',
          tags: [
            { label: 'URGENT', tone: 'red' },
            { label: 'DEVELOPMENT', tone: 'blue' },
          ],
          dueDate: '2026-05-01',
          commentList: [
            {
              id: 'db-c1',
              author: 'Tina Evans',
              text: 'Draft ERD is ready; relationships for comments and attachments are included.',
            },
            {
              id: 'db-c2',
              author: 'Luca Cole',
              text: 'Let us index boardId + updatedAt to speed up board loading.',
            },
            {
              id: 'db-c3',
              author: 'James Martin',
              text: 'Please split audit logs into a separate table to keep tasks lightweight.',
            },
            {
              id: 'db-c4',
              author: 'Amy Diaz',
              text: 'Can we support soft delete so recovered cards keep their history?',
            },
            {
              id: 'db-c5',
              author: 'Ryan Knight',
              text: 'Migration draft is in progress; I will share after QA sanity checks.',
            },
          ],
          assignees: [
            {
              id: 'tina',
              name: 'Tina Evans',
              avatar: 'https://i.pravatar.cc/40?img=5',
            },
          ],
          checklist: [
            { id: 'db-t1', text: 'Model core entities', completed: true },
            { id: 'db-t2', text: 'Define indexes & constraints', completed: true },
            { id: 'db-t3', text: 'Draft migrations', completed: false },
            { id: 'db-t4', text: 'Review with platform', completed: false },
            { id: 'db-t5', text: 'Sign off ERD', completed: false },
          ],
        },
        {
          id: 'wireframes-v1',
          title: 'Wireframes V1',
          description: 'Create low-fidelity wireframes for dashboard and task detail views.',
          tags: [{ label: 'DESIGN', tone: 'purple' }],
          dueDate: '2026-10-25',
          commentList: [
            {
              id: 'wf-c1',
              author: 'Amy Diaz',
              text: 'Dashboard layout looks clean; I left notes on spacing in frame 3.',
            },
            {
              id: 'wf-c2',
              author: 'James Martin',
              text: 'Can we add a compact mode variant before the next review?',
            },
            {
              id: 'wf-c3',
              author: 'Tina Evans',
              text: 'I uploaded alternate typography options in the same design file.',
            },
          ],
          assignees: [
            {
              id: 'ryan',
              name: 'Ryan Knight',
              avatar: 'https://i.pravatar.cc/40?img=31',
            },
            {
              id: 'james',
              name: 'James Martin',
              avatar: 'https://i.pravatar.cc/40?img=12',
            },
            {
              id: 'amy',
              name: 'Amy Diaz',
              avatar: 'https://i.pravatar.cc/40?img=47',
            },
          ],
          checklist: [
            { id: 'wf-t1', text: 'Dashboard frames', completed: true },
            { id: 'wf-t2', text: 'Card detail + modals', completed: false },
          ],
        },
      ],
    },
    {
      id: 'in-review',
      title: 'In Review',
      cards: [
        {
          id: 'api-auth',
          title: 'API Authentication',
          description: 'Implement JWT-based authentication for the mobile app endpoints.',
          tags: [{ label: 'DEVELOPMENT', tone: 'blue' }],
          dueDate: '2026-10-24',
          commentList: [
            {
              id: 'api-c1',
              author: 'Luca Cole',
              text: 'Token refresh endpoint is working; I still need to add rate-limit middleware.',
            },
            {
              id: 'api-c2',
              author: 'Tina Evans',
              text: 'Please document auth error codes in the API README.',
            },
            {
              id: 'api-c3',
              author: 'James Martin',
              text: 'Swagger docs should include expired-token and invalid-scope examples.',
            },
            {
              id: 'api-c4',
              author: 'Amy Diaz',
              text: 'Mobile team asked for a sample curl flow for login + refresh.',
            },
            {
              id: 'api-c5',
              author: 'Ryan Knight',
              text: 'Added integration tests for refresh token reuse detection.',
            },
          ],
          assignees: [
            {
              id: 'luca',
              name: 'Luca Cole',
              avatar: 'https://i.pravatar.cc/40?img=22',
            },
          ],
          checklist: [
            { id: 'api-t1', text: 'Login + refresh flow', completed: true },
            { id: 'api-t2', text: 'Rate limiting', completed: true },
            { id: 'api-t3', text: 'Docs & examples', completed: false },
          ],
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        {
          id: 'project-kickoff',
          title: 'Project Kickoff',
          description: 'Initial meeting with stakeholders to finalize scope and milestones.',
          tags: [{ label: 'RESEARCH', tone: 'green' }],
          dueDate: '2026-10-15',
          commentList: [
            {
              id: 'pk-c1',
              author: 'Amy Diaz',
              text: 'Kickoff notes uploaded. Milestone deadlines are confirmed with stakeholders.',
            },
            {
              id: 'pk-c2',
              author: 'James Martin',
              text: 'Next sync is set for Monday to review sprint one deliverables.',
            },
            {
              id: 'pk-c3',
              author: 'Luca Cole',
              text: 'Risk register has been created with owners for each major dependency.',
            },
          ],
          assignees: [
            {
              id: 'amy',
              name: 'Amy Diaz',
              avatar: 'https://i.pravatar.cc/40?img=47',
            },
            {
              id: 'tina',
              name: 'Tina Evans',
              avatar: 'https://i.pravatar.cc/40?img=5',
            },
            {
              id: 'james',
              name: 'James Martin',
              avatar: 'https://i.pravatar.cc/40?img=12',
            },
            {
              id: 'luca',
              name: 'Luca Cole',
              avatar: 'https://i.pravatar.cc/40?img=22',
            },
          ],
          checklist: [{ id: 'pk-t1', text: 'Kickoff complete', completed: true }],
          done: true,
        },
      ],
    },
  ],
}
