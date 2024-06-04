// client/src/utils/mutations.js
import { gql } from '@apollo/client';

export const ADD_PROFILE = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_EVENT = gql`
  mutation addEvent(
    $event_name: String!,
    $date: String,
    $location: String,
    $budget: Float,
    $venue_layout: String,
    $guest_count: Int,
    $theme: String,
    $food_options: String,
    $entertainment: String,
    $decorations: String,
    $details: String
  ) {
    addEvent(
      event_name: $event_name,
      date: $date,
      location: $location,
      budget: $budget,
      venue_layout: $venue_layout,
      guest_count: $guest_count,
      theme: $theme,
      food_options: $food_options,
      entertainment: $entertainment,
      decorations: $decorations,
      details: $details
    ) {
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
      }
    }
  }
`;

export const EDIT_EVENT = gql`
  mutation editEvent(
    $eventId: ID!,
    $event_name: String,
    $date: String,
    $location: String,
    $budget: Float,
    $venue_layout: String,
    $guest_count: Int,
    $theme: String,
    $food_options: String,
    $entertainment: String,
    $decorations: String,
    $details: String
  ) {
    editEvent(
      eventId: $eventId,
      event_name: $event_name,
      date: $date,
      location: $location,
      budget: $budget,
      venue_layout: $venue_layout,
      guest_count: $guest_count,
      theme: $theme,
      food_options: $food_options,
      entertainment: $entertainment,
      decorations: $decorations,
      details: $details
    ) {
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
      }
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId) {
      _id
      event_name
    }
  }
`;

export const ADD_TASK = gql`
  mutation addTask($task_name: String!, $details: String, $eventId: ID!) {
    addTask(task_name: $task_name, details: $details, eventId: $eventId) {
      _id
      task_name
      details
      complete
    }
  }
`;

export const EDIT_TASK = gql`
  mutation editTask($taskId: ID!, $task_name: String, $details: String, $complete: Boolean) {
    editTask(taskId: $taskId, task_name: $task_name, details: $details, complete: $complete) {
      _id
      task_name
      details
      complete
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      _id
      task_name
    }
  }
`;