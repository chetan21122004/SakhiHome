"use client";

import Image from "next/image";
import type { MaidSharePayload } from "@/lib/maid-share";

type Props = { profile: MaidSharePayload };

export default function MaidShareView({ profile }: Props) {
  const isFull = profile.tier === "full";

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      {isFull && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Full profile — shared by SakhiHome for your review. Documents are
          view-only; downloads are not provided on this page.
        </p>
      )}
      {!isFull && (
        <p className="mb-4 text-sm text-muted-foreground">
          Basic preview — contact SakhiHome to proceed with placement.
        </p>
      )}

      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {profile.photoViewUrl && (
          <div
            className="relative aspect-[4/3] bg-muted"
            onContextMenu={(e) => e.preventDefault()}
          >
            <Image
              src={profile.photoViewUrl}
              alt=""
              fill
              className="object-cover select-none"
              unoptimized
              draggable={false}
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="font-display text-2xl font-bold">{profile.displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{profile.area}</p>
          {profile.status && (
            <span className="mt-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {profile.status}
            </span>
          )}

          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Services</dt>
              <dd>{profile.services.join(" · ") || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Experience</dt>
              <dd>{profile.experience} years</dd>
            </div>
            {profile.languages && (
              <div>
                <dt className="font-medium text-muted-foreground">Languages</dt>
                <dd>{profile.languages}</dd>
              </div>
            )}
            {profile.schedule && (
              <div>
                <dt className="font-medium text-muted-foreground">Schedule</dt>
                <dd>{profile.schedule}</dd>
              </div>
            )}
            {isFull && profile.phone && (
              <div>
                <dt className="font-medium text-muted-foreground">Phone</dt>
                <dd>
                  <a href={`tel:${profile.phone}`} className="text-primary">
                    {profile.phone}
                  </a>
                </dd>
              </div>
            )}
            {isFull && profile.salary && (
              <div>
                <dt className="font-medium text-muted-foreground">
                  Salary expectation
                </dt>
                <dd>{profile.salary}</dd>
              </div>
            )}
            {isFull && profile.address && (
              <div>
                <dt className="font-medium text-muted-foreground">Address</dt>
                <dd>{profile.address}</dd>
              </div>
            )}
            {isFull && profile.maritalStatus && (
              <div>
                <dt className="font-medium text-muted-foreground">
                  Marital status
                </dt>
                <dd>{profile.maritalStatus}</dd>
              </div>
            )}
            {isFull && profile.guardian && (
              <div>
                <dt className="font-medium text-muted-foreground">
                  Guardian / spouse
                </dt>
                <dd>{profile.guardian}</dd>
              </div>
            )}
            {isFull && profile.dependants && (
              <div>
                <dt className="font-medium text-muted-foreground">
                  Dependants
                </dt>
                <dd>{profile.dependants}</dd>
              </div>
            )}
            {isFull && profile.emergency && (
              <div>
                <dt className="font-medium text-muted-foreground">Emergency</dt>
                <dd>{profile.emergency}</dd>
              </div>
            )}
          </dl>

          {isFull && profile.documents && profile.documents.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Documents on file
              </h2>
              <ul className="mt-3 space-y-4">
                {profile.documents.map((doc, i) => (
                  <li key={`${doc.category}-${i}`} className="rounded-lg border p-3">
                    <p className="font-medium">{doc.category}</p>
                    {doc.note && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {doc.note}
                      </p>
                    )}
                    {doc.mimeKind === "pdf" && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        PDF on file ({doc.fileName}) — available in office
                        records only
                      </p>
                    )}
                    {doc.mimeKind === "other" && !doc.viewUrl && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {doc.fileName}
                      </p>
                    )}
                    {doc.viewUrl && (
                      <div
                        className="relative mt-2 aspect-video overflow-hidden rounded-md bg-muted"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <Image
                          src={doc.viewUrl}
                          alt=""
                          fill
                          className="object-contain select-none"
                          unoptimized
                          draggable={false}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        SakhiHome · Private profile link · Not for redistribution
      </p>
    </div>
  );
}
