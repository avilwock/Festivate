// client/src/utils/queries.js
import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      events {
        _id
        event_name
        date
        location
        tasks {
          _id
          task_name
          complete
        }
      }
    }
  }
`;
