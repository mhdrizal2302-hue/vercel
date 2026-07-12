import type Client from '../client';
import { detectExplicitScope } from '../get-scope';
import { getLinkedProject, type ProjectLinkResultWithOrgId } from './link';
import { printProjectNotFoundError } from './project-not-found-error';

export interface ResolveProjectContextOptions {
  client: Client;
  cwd?: string;
  projectNameOrId?: string;
}

/**
 * Resolves project context without linking the directory or creating a project.
 */
export async function resolveProjectContext({
  client,
  cwd = client.cwd,
  projectNameOrId,
}: ResolveProjectContextOptions): Promise<ProjectLinkResultWithOrgId> {
  const context = await getLinkedProject(client, {
    cwd,
    projectName: projectNameOrId,
    projectNameIsExplicit: Boolean(projectNameOrId),
    scopeIsExplicit: detectExplicitScope(client),
  });

  if (context.status === 'not_linked' && projectNameOrId) {
    await printProjectNotFoundError(client, projectNameOrId, context.orgId);
    return { status: 'error', exitCode: 1, orgId: context.orgId };
  }

  return context;
}
