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
        budget
        venue_layout
        guest_count
        theme
        food_options
        entertainment
        decorations
        details
        tasks {
          _id
          task_name
          complete
        }
      }
    }
  }
`;

export const QUERY_EVENT = gql`
  query event($id: ID!) {
    event(id: $id) {
      _id
      event_name
      date
      location
      budget
      venue_layout
      guest_count
      theme
      food_options
      entertainment
      decorations
      details
      tasks {
        _id
        task_name
        complete
      }
    }
  }
`;

export const QUERY_TASK = gql`
  query task($id: ID!) {
    task(id: $id) {
      _id
      task_name
      details
      complete
      event {
        _id
        event_name
      }
    }
  }
`;
