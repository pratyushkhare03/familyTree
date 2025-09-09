import React from 'react';
import { Pencil, MapPin, Mail, Phone, Link2, Briefcase, GraduationCap, Award, User } from 'lucide-react';

export default function ProfileDetail({ member, onEdit }) {
  if (!member) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-slate-700 dark:text-slate-200">
        Select a member from the list to view the profile.
      </div>
    );
  }

  // Safeguard defaults
  const {
    name = 'Unnamed',
    title = member.notes || '—',
    location = '',
    email = '',
    phone = '',
    website = '',
    about = '',
    experience = [],
    education = [],
    skills = [],
    achievements = [],
    avatarUrl = '',
    bannerUrl = '',
  } = member;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Banner */}
      <div
  className="h-40 sm:h-52 w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 overflow-hidden mb-4"
>
  {bannerUrl ? (
    <img
      src={bannerUrl}
      alt="banner"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700" />
  )}
</div>


      {/* Header: avatar + identity */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
          {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-slate-500" />}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{name}</h1>
          <p className="text-slate-600 dark:text-slate-300">{title || '—'}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600 dark:text-slate-300">
            {location && <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</span>}
            {email && <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4" /> {email}</span>}
            {phone && <span className="inline-flex items-center gap-1"><Phone className="w-4 h-4" /> {phone}</span>}
            {website && <span className="inline-flex items-center gap-1"><Link2 className="w-4 h-4" /> {website}</span>}
          </div>
        </div>
        <button
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          onClick={onEdit}
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* About */}
      <section className="p-4 border rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{about || 'No bio yet.'}</p>
      </section>

      {/* Experience */}
      <section className="p-4 border rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Briefcase className="w-5 h-5" /> Experience</h2>
        <div className="space-y-3">
          {(experience && experience.length ? experience : []).map((exp, i) => (
            <div key={i} className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="font-medium">{exp.role || 'Role'}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{exp.company || 'Company'} • {exp.period || '—'}</div>
              {exp.desc && <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{exp.desc}</p>}
            </div>
          ))}
          {(!experience || experience.length === 0) && <div className="text-sm text-slate-500">No experience added.</div>}
        </div>
      </section>

      {/* Education */}
      <section className="p-4 border rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Education</h2>
        <div className="space-y-3">
          {(education && education.length ? education : []).map((ed, i) => (
            <div key={i} className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="font-medium">{ed.school || 'School'}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{ed.degree || 'Degree'} • {ed.period || '—'}</div>
            </div>
          ))}
          {(!education || education.length === 0) && <div className="text-sm text-slate-500">No education added.</div>}
        </div>
      </section>

      {/* Skills */}
      <section className="p-4 border rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <h2 className="text-lg font-semibold mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {(skills && skills.length ? skills : []).map((s, i) => (
            <span key={i} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 text-xs">{s}</span>
          ))}
          {(!skills || skills.length === 0) && <div className="text-sm text-slate-500">No skills added.</div>}
        </div>
      </section>

      {/* Achievements */}
      <section className="p-4 border rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Award className="w-5 h-5" /> Achievements</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
          {(achievements && achievements.length ? achievements : []).map((a, i) => (
            <li key={i}>{a}</li>
          ))}
          {(!achievements || achievements.length === 0) && <div className="text-sm text-slate-500">No achievements added.</div>}
        </ul>
      </section>
    </div>
  );
}
