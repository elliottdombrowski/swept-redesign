import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($email: String!, $password: String!) {
    updatePassword(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const DARKMODE = gql`
  mutation darkmode($darkmode: Boolean!) {
    darkmode(darkmode: $darkmode) {
      token
      user {
        darkmode
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_SWEEPER = gql`
  mutation saveSweeper(
    $ward: String!
    $section: String!
    $month_name: String!
    $dates: String!
    $zipcode: String!
    $user: String!
  ) {
    saveSweeper(
      ward: $ward
      section: $section
      month_name: $month_name
      dates: $dates
      zipcode: $zipcode
      user: $user
    ) {
      ward
      section
      month_name
      dates
      zipcode
      user
    }
  }
`;

export const SAVE_SNOW = gql`
mutation saveSnow(
  $on_street: String!
  $from_stree: String!
  $to_street: String!
  $restrict_t: String!
  $user: String!
) {
  saveSnow(
    on_street: $on_street
    from_stree: $from_stree
    to_street: $to_street
    restrict_t: $restrict_t
    user: $user
  ) {
    on_street
    from_stree
    to_street
    restrict_t
    user
  }
}
`;

export const MAKE_DONATION = gql `
  mutation makeDonation(
    $input: StripeInfo
  ) {
    makeDonation(
      input: $input
    ) {
      status
    }
  }
`;