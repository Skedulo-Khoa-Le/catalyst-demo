/**
 * Validates if a string is a valid Jira issue ticket name.
 * Valid Jira ticket format: PROJECT-123 (project code in uppercase, followed by hyphen and numbers)
 *
 * @param ticket - The ticket string to validate
 * @returns boolean - True if the ticket name is valid, false otherwise
 */
export function isValidJiraTicket(ticket: string): boolean {
  if (!ticket) return false;

  // Jira ticket format: PROJECT-123
  // Project codes are uppercase letters, followed by hyphen and numbers
  const jiraTicketRegex = /^[A-Z]+-\d+$/;

  return jiraTicketRegex.test(ticket);
}
