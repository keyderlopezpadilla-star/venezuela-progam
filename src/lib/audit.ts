/**
 * Audit logger helper. Estructura compatible con una futura capa blockchain-ready:
 * cada entrada es hasheable y contiene un hash previo para encadenar.
 */
import { db } from './db';
import { createHash } from 'node:crypto';

export async function audit(opts: {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  severity?: 'info' | 'warn' | 'error' | 'critical';
}) {
  const last = await db.auditLog.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });
  const prevHash = last ? createHash('sha256').update(last.id).digest('hex').slice(0, 16) : '0'.repeat(16);
  const payload = JSON.stringify({ ...opts, ts: new Date().toISOString(), prevHash });
  const hash = createHash('sha256').update(payload).digest('hex').slice(0, 32);

  return db.auditLog.create({
    data: {
      userId: opts.userId ?? null,
      action: opts.action,
      resource: opts.resource,
      resourceId: opts.resourceId,
      ipAddress: opts.ipAddress,
      userAgent: opts.userAgent,
      metadata: { ...(opts.metadata ?? {}), hash } as any,
      severity: opts.severity ?? 'info',
    },
  });
}
