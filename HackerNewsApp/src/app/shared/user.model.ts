export class User {
  /**
   * The user's unique username. Case-sensitive. Required.
   */
  id: string;

  /**
   * The user's optional self-description. HTML.
   */
  about: string;

  /**
   * Creation date of the user, in Unix Time.
   */
  created: number;

  /**
   * The user's karma.
   */
  karma: number;

  /**
   * List of the user's stories, polls and comments.
   */
  submitted: Array<number>;
}