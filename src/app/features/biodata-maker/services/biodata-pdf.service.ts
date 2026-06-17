import { Injectable } from '@angular/core';
import { BiodataData, BiodataTemplateId } from '../models/biodata.model';

function slugify(value: string): string {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'biodata';
}

@Injectable({ providedIn: 'root' })
export class BiodataPdfService {
  async download(biodata: BiodataData): Promise<void> {
    const [pdfMakeModule, vfsFontsModule] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);
    const pdfMake = (pdfMakeModule as any).default ?? pdfMakeModule;
    const vfs = (vfsFontsModule as any).default ?? vfsFontsModule;
    pdfMake.addVirtualFileSystem(vfs);

    const docDefinition = this.buildDoc(biodata);
    const filename = `${slugify(biodata.personal.fullName || biodata.name)}-biodata.pdf`;
    pdfMake.createPdf(docDefinition).download(filename);
  }

  private buildDoc(b: BiodataData): any {
    switch (b.templateId) {
      case 'professional':   return this.buildProfessionalDoc(b);
      case 'modern-card':    return this.buildModernCardDoc(b);
      default:               return this.buildClassicMarriageDoc(b);
    }
  }

  // ── Classic Marriage ──────────────────────────────────────────────────────

  private buildClassicMarriageDoc(b: BiodataData): any {
    const p = b.personal;
    const c = b.contact;
    const f = b.family;
    const pr = b.professional;
    const pref = b.partnerPreferences;
    const accent = '#9d174d';
    const lightAccent = '#fce7f3';

    const row = (label: string, value: string) =>
      value ? [{ text: `${label}: `, bold: true, color: '#374151' }, { text: value, color: '#1f2937' }] : null;

    const rows = (pairs: Array<[string, string]>) =>
      pairs
        .filter(([, v]) => !!v)
        .map(([l, v]) => ({ columns: [{ text: l + ':', bold: true, color: accent, width: 130 }, { text: v, color: '#1f2937', fontSize: 9 }], columnGap: 4, margin: [0, 1, 0, 1] as [number, number, number, number] }));

    const sectionHeader = (title: string) => ({
      text: `— ${title} —`,
      style: 'sectionHeader',
    });

    const content: any[] = [];

    // Header
    content.push({ text: 'BIODATA', style: 'mainTitle', alignment: 'center' });
    if (b.type === 'marriage') {
      content.push({ text: '🌸 Marriage Biodata 🌸', style: 'subtitle', alignment: 'center' });
    }
    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: accent }], margin: [0, 8, 0, 16] });

    // Photo + Personal details side by side
    const personalPairs: Array<[string, string]> = [
      ['Full Name', p.fullName],
      ['Date of Birth', p.dateOfBirth],
      ['Time of Birth', p.timeOfBirth],
      ['Place of Birth', p.placeOfBirth],
      ['Religion', p.religion],
      ['Caste', p.caste],
      ['Sub-Caste', p.subCaste],
      ['Gotra', p.gotra],
      ['Height', p.height],
      ['Weight', p.weight],
      ['Complexion', p.complexion],
      ['Blood Group', p.bloodGroup],
      ['Marital Status', p.maritalStatus],
      ['Mother Tongue', p.motherTongue],
      ['Nationality', p.nationality],
      ['Manglik', p.manglik],
      ['Diet', p.diet],
    ];

    const personalContent = {
      stack: rows(personalPairs),
    };

    if (p.photo && p.photo.startsWith('data:')) {
      content.push({
        columns: [
          { stack: [sectionHeader('Personal Information'), personalContent], width: '*' },
          { image: p.photo, width: 90, height: 110, alignment: 'center', margin: [8, 20, 0, 0] as [number, number, number, number] },
        ],
      });
    } else {
      content.push(sectionHeader('Personal Information'));
      content.push({ stack: rows(personalPairs), margin: [0, 4, 0, 0] as [number, number, number, number] });
    }

    // Family
    if (b.type === 'marriage' && (b.sectionVisibility['family'] ?? true)) {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 12, 0, 4] });
      content.push(sectionHeader('Family Information'));
      const familyPairs: Array<[string, string]> = [
        ["Father's Name", f.fatherName],
        ["Father's Occupation", f.fatherOccupation],
        ["Mother's Name", f.motherName],
        ["Mother's Occupation", f.motherOccupation],
        ['Brothers', f.brothers],
        ['Sisters', f.sisters],
        ['Family Type', f.familyType],
        ['Family Status', f.familyStatus],
        ['Family Values', f.familyValues],
        ['Native Place', f.nativePlace],
      ];
      content.push({ stack: rows(familyPairs), margin: [0, 4, 0, 0] as [number, number, number, number] });
      if (f.aboutFamily) {
        content.push({ text: 'About Family: ', bold: true, color: accent, margin: [0, 4, 0, 0] as [number, number, number, number] });
        content.push({ text: f.aboutFamily, color: '#374151', fontSize: 9, italics: true });
      }
    }

    // Education
    if (b.education.length > 0 && (b.sectionVisibility['education'] ?? true)) {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 12, 0, 4] });
      content.push(sectionHeader('Education'));
      const eduRows = b.education.map(e => [
        { text: e.degree + (e.field ? ` (${e.field})` : ''), bold: true, color: '#1f2937', fontSize: 9 },
        { text: e.institution, color: '#374151', fontSize: 9 },
        { text: e.year, color: '#6b7280', fontSize: 9 },
        { text: e.grade, color: '#6b7280', fontSize: 9 },
      ]);
      content.push({
        table: {
          widths: ['*', '*', 60, 60],
          body: [
            [{ text: 'Degree', bold: true, color: accent, fontSize: 9 }, { text: 'Institution', bold: true, color: accent, fontSize: 9 }, { text: 'Year', bold: true, color: accent, fontSize: 9 }, { text: 'Grade', bold: true, color: accent, fontSize: 9 }],
            ...eduRows,
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 4, 0, 0] as [number, number, number, number],
      });
    }

    // Professional
    if ((b.sectionVisibility['professional'] ?? true) && Object.values(pr).some(Boolean)) {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 12, 0, 4] });
      content.push(sectionHeader('Professional Details'));
      const profPairs: Array<[string, string]> = [
        ['Occupation', pr.occupation],
        ['Job Title', pr.jobTitle],
        ['Employer', pr.employer],
        ['Work Experience', pr.workExperience],
        ['Annual Income', pr.annualIncome],
        ['Work Location', [pr.workCity, pr.workCountry].filter(Boolean).join(', ')],
      ];
      content.push({ stack: rows(profPairs), margin: [0, 4, 0, 0] as [number, number, number, number] });
    }

    // Skills & Hobbies
    if ((b.sectionVisibility['skills'] ?? true) && (b.skills.length > 0 || b.hobbies.length > 0 || b.languages.length > 0)) {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 12, 0, 4] });
      content.push(sectionHeader('Skills & Interests'));
      if (b.skills.length > 0) content.push({ columns: [{ text: 'Skills:', bold: true, color: accent, width: 80, fontSize: 9 }, { text: b.skills.join(' • '), color: '#374151', fontSize: 9 }], margin: [0, 3, 0, 0] as [number, number, number, number] });
      if (b.hobbies.length > 0) content.push({ columns: [{ text: 'Hobbies:', bold: true, color: accent, width: 80, fontSize: 9 }, { text: b.hobbies.join(' • '), color: '#374151', fontSize: 9 }], margin: [0, 3, 0, 0] as [number, number, number, number] });
      if (b.languages.length > 0) content.push({ columns: [{ text: 'Languages:', bold: true, color: accent, width: 80, fontSize: 9 }, { text: b.languages.join(' • '), color: '#374151', fontSize: 9 }], margin: [0, 3, 0, 0] as [number, number, number, number] });
    }

    // Achievements
    if ((b.sectionVisibility['achievements'] ?? true) && b.achievements.length > 0) {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 12, 0, 4] });
      content.push(sectionHeader('Achievements'));
      content.push({ ul: b.achievements, color: '#374151', fontSize: 9, margin: [0, 4, 0, 0] as [number, number, number, number] });
    }

    // Partner Preferences
    if (b.type === 'marriage' && (b.sectionVisibility['partnerPreferences'] ?? true)) {
      const pp = pref;
      const hasPref = Object.values(pp).some(Boolean);
      if (hasPref) {
        content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 12, 0, 4] });
        content.push(sectionHeader('Partner Expectations'));
        const prefPairs: Array<[string, string]> = [
          ['Age', pp.ageFrom && pp.ageTo ? `${pp.ageFrom} – ${pp.ageTo} years` : (pp.ageFrom || pp.ageTo)],
          ['Height', pp.heightFrom && pp.heightTo ? `${pp.heightFrom} – ${pp.heightTo}` : (pp.heightFrom || pp.heightTo)],
          ['Religion', pp.religion],
          ['Caste', pp.caste],
          ['Education', pp.education],
          ['Occupation', pp.occupation],
          ['Location', pp.location],
          ['Other', pp.other],
        ];
        content.push({ stack: rows(prefPairs), margin: [0, 4, 0, 0] as [number, number, number, number] });
      }
    }

    // Contact
    if (b.sectionVisibility['contact'] ?? true) {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 12, 0, 4] });
      content.push(sectionHeader('Contact Information'));
      const contactPairs: Array<[string, string]> = [
        ['Phone', c.phone],
        ['WhatsApp', c.whatsapp],
        ['Email', c.email],
        ['Address', [c.address, c.city, c.state, c.pincode, c.country].filter(Boolean).join(', ')],
      ];
      content.push({ stack: rows(contactPairs), margin: [0, 4, 0, 0] as [number, number, number, number] });
    }

    // Footer
    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: accent }], margin: [0, 20, 0, 8] });
    content.push({ text: 'Created with ApnaConverter — apnaconverter.com', color: '#9ca3af', fontSize: 8, alignment: 'center' });

    return {
      content,
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40] as [number, number, number, number],
      defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.3 },
      styles: {
        mainTitle: { fontSize: 22, bold: true, color: accent, letterSpacing: 4 },
        subtitle: { fontSize: 11, color: '#6b7280', margin: [0, 4, 0, 0] as [number, number, number, number] },
        sectionHeader: { fontSize: 11, bold: true, color: accent, alignment: 'center' as const, margin: [0, 8, 0, 4] as [number, number, number, number] },
      },
    };
  }

  // ── Professional ──────────────────────────────────────────────────────────

  private buildProfessionalDoc(b: BiodataData): any {
    const p = b.personal;
    const c = b.contact;
    const pr = b.professional;
    const accent = '#3730a3';

    const row = (label: string, value: string) =>
      value ? { columns: [{ text: label + ':', bold: true, color: accent, width: 120, fontSize: 9 }, { text: value, color: '#1f2937', fontSize: 9 }], margin: [0, 1.5, 0, 1.5] as [number, number, number, number] } : null;

    const content: any[] = [];

    // Header
    const headerLeft: any[] = [
      { text: p.fullName || 'Full Name', style: 'name' },
    ];
    if (pr.jobTitle) headerLeft.push({ text: pr.jobTitle, style: 'jobTitle' });
    const contactLine = [c.email, c.phone, [c.city, c.state].filter(Boolean).join(', ')].filter(Boolean).join('  |  ');
    if (contactLine) headerLeft.push({ text: contactLine, style: 'contactLine' });

    if (p.photo && p.photo.startsWith('data:')) {
      content.push({
        columns: [
          { stack: headerLeft, width: '*' },
          { image: p.photo, width: 80, height: 100, alignment: 'right' as const },
        ],
        margin: [0, 0, 0, 8] as [number, number, number, number],
      });
    } else {
      content.push({ stack: headerLeft, margin: [0, 0, 0, 8] as [number, number, number, number] });
    }

    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: accent }], margin: [0, 0, 0, 12] });

    const addSection = (title: string, body: any[]) => {
      const filtered = body.filter(Boolean);
      if (!filtered.length) return;
      content.push({ text: title, style: 'sectionHeader' });
      content.push({ stack: filtered, margin: [0, 4, 0, 0] as [number, number, number, number] });
      content.push({ margin: [0, 8, 0, 0] as [number, number, number, number], text: '' });
    };

    addSection('Personal Information', [
      row('Date of Birth', p.dateOfBirth),
      row('Gender', p.gender),
      row('Blood Group', p.bloodGroup),
      row('Marital Status', p.maritalStatus),
      row('Mother Tongue', p.motherTongue),
      row('Nationality', p.nationality),
      row('Religion', p.religion),
    ]);

    addSection('Professional Details', [
      row('Occupation', pr.occupation),
      row('Job Title', pr.jobTitle),
      row('Employer', pr.employer),
      row('Work Experience', pr.workExperience),
      row('Annual Income', pr.annualIncome),
      row('Work Location', [pr.workCity, pr.workCountry].filter(Boolean).join(', ')),
    ]);

    if (b.education.length > 0) {
      content.push({ text: 'Education', style: 'sectionHeader' });
      b.education.forEach(e => {
        content.push({
          columns: [
            { text: `${e.degree}${e.field ? ` in ${e.field}` : ''}`, bold: true, color: '#1f2937', fontSize: 9, width: '*' },
            { text: e.year, color: '#6b7280', fontSize: 9, width: 60 },
          ],
          margin: [0, 2, 0, 0] as [number, number, number, number],
        });
        content.push({ text: e.institution, color: '#4b5563', fontSize: 9, margin: [0, 0, 0, e.grade ? 0 : 6] as [number, number, number, number] });
        if (e.grade) content.push({ text: `Grade: ${e.grade}`, color: '#6b7280', fontSize: 8, margin: [0, 0, 0, 6] as [number, number, number, number] });
      });
    }

    if (b.skills.length > 0) addSection('Skills', [{ text: b.skills.join(' • '), color: '#374151', fontSize: 9 }]);
    if (b.languages.length > 0) addSection('Languages', [{ text: b.languages.join(' • '), color: '#374151', fontSize: 9 }]);
    if (b.hobbies.length > 0) addSection('Hobbies & Interests', [{ text: b.hobbies.join(' • '), color: '#374151', fontSize: 9 }]);
    if (b.achievements.length > 0) addSection('Achievements', [{ ul: b.achievements, color: '#374151', fontSize: 9 }]);

    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }], margin: [0, 8, 0, 8] });
    content.push({ text: 'Created with ApnaConverter — apnaconverter.com', color: '#9ca3af', fontSize: 8, alignment: 'center' });

    return {
      content,
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40] as [number, number, number, number],
      defaultStyle: { font: 'Roboto', fontSize: 10 },
      styles: {
        name: { fontSize: 20, bold: true, color: '#111827' },
        jobTitle: { fontSize: 12, color: accent, margin: [0, 2, 0, 0] as [number, number, number, number] },
        contactLine: { fontSize: 9, color: '#6b7280', margin: [0, 4, 0, 0] as [number, number, number, number] },
        sectionHeader: { fontSize: 11, bold: true, color: accent, margin: [0, 8, 0, 0] as [number, number, number, number] },
      },
    };
  }

  // ── Modern Card ───────────────────────────────────────────────────────────

  private buildModernCardDoc(b: BiodataData): any {
    const p = b.personal;
    const c = b.contact;
    const pr = b.professional;
    const f = b.family;
    const accent = '#7c3aed';
    const lightBg = '#f3f4f6';

    const chip = (text: string) => ({ text: `  ${text}  `, color: '#ffffff', background: accent, fontSize: 8, margin: [0, 0, 4, 4] as [number, number, number, number] });
    const infoRow = (label: string, value: string) =>
      value ? { columns: [{ text: label, bold: true, color: '#6b7280', width: 110, fontSize: 8 }, { text: value, color: '#1f2937', fontSize: 9 }], margin: [0, 2, 0, 2] as [number, number, number, number] } : null;

    const content: any[] = [];

    // Header block
    const ageStr = p.dateOfBirth ? ` • ${p.dateOfBirth}` : '';
    const heightStr = p.height ? ` • ${p.height}` : '';
    const subLine = [p.religion, p.caste, p.maritalStatus].filter(Boolean).join(' • ');

    const headerTextStack: any[] = [
      { text: p.fullName || 'Full Name', style: 'name' },
    ];
    if (ageStr || heightStr) headerTextStack.push({ text: `DOB: ${p.dateOfBirth || ''}${heightStr}`, color: '#e0e7ff', fontSize: 10, margin: [0, 4, 0, 0] as [number, number, number, number] });
    if (subLine) headerTextStack.push({ text: subLine, color: '#c7d2fe', fontSize: 9, margin: [0, 2, 0, 0] as [number, number, number, number] });
    const contactStr = [c.phone, c.email].filter(Boolean).join('  |  ');
    if (contactStr) headerTextStack.push({ text: contactStr, color: '#a5b4fc', fontSize: 8, margin: [0, 4, 0, 0] as [number, number, number, number] });

    if (p.photo && p.photo.startsWith('data:')) {
      content.push({
        table: {
          widths: ['*', 90],
          body: [[
            { stack: headerTextStack, fillColor: accent, color: '#fff', margin: [16, 16, 8, 16] as [number, number, number, number], border: [false, false, false, false] },
            { image: p.photo, width: 75, height: 90, margin: [4, 12, 12, 12] as [number, number, number, number], fillColor: accent, border: [false, false, false, false] },
          ]],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 16] as [number, number, number, number],
      });
    } else {
      content.push({ stack: headerTextStack, fillColor: accent, color: '#fff', padding: [16, 16, 16, 16] as [number, number, number, number], margin: [0, 0, 0, 16] as [number, number, number, number] });
    }

    const card = (title: string, rows: any[]) => {
      const filtered = rows.filter(Boolean);
      if (!filtered.length) return null;
      return {
        stack: [
          { text: title, bold: true, color: accent, fontSize: 10, margin: [0, 0, 0, 6] as [number, number, number, number] },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: accent }], margin: [0, 0, 0, 6] },
          ...filtered,
        ],
        margin: [0, 0, 0, 14] as [number, number, number, number],
      };
    };

    content.push(card('Personal Details', [
      infoRow('Date of Birth', p.dateOfBirth),
      infoRow('Time of Birth', p.timeOfBirth),
      infoRow('Place of Birth', p.placeOfBirth),
      infoRow('Blood Group', p.bloodGroup),
      infoRow('Religion', p.religion),
      infoRow('Caste', `${p.caste}${p.subCaste ? ` / ${p.subCaste}` : ''}`),
      infoRow('Gotra', p.gotra),
      infoRow('Manglik', p.manglik),
      infoRow('Diet', p.diet),
      infoRow('Mother Tongue', p.motherTongue),
    ]));

    content.push(card('Professional Details', [
      infoRow('Occupation', pr.occupation),
      infoRow('Employer', pr.employer),
      infoRow('Annual Income', pr.annualIncome),
      infoRow('Work Experience', pr.workExperience),
      infoRow('Work Location', [pr.workCity, pr.workCountry].filter(Boolean).join(', ')),
    ]));

    if (b.education.length > 0) {
      const eduRows = b.education.map(e => ({
        columns: [
          { text: `${e.degree}${e.field ? ` — ${e.field}` : ''}`, bold: true, color: '#1f2937', fontSize: 9, width: '*' },
          { text: e.year, color: '#6b7280', fontSize: 8, width: 45 },
        ],
        margin: [0, 2, 0, 0] as [number, number, number, number],
      }));
      content.push(card('Education', eduRows));
    }

    if (b.type === 'marriage') {
      content.push(card('Family Information', [
        infoRow("Father's Name", f.fatherName),
        infoRow("Father's Occupation", f.fatherOccupation),
        infoRow("Mother's Name", f.motherName),
        infoRow("Mother's Occupation", f.motherOccupation),
        infoRow('Brothers', f.brothers),
        infoRow('Sisters', f.sisters),
        infoRow('Family Type', f.familyType),
        infoRow('Family Status', f.familyStatus),
        infoRow('Native Place', f.nativePlace),
      ]));
    }

    if (b.skills.length > 0 || b.hobbies.length > 0) {
      content.push(card('Skills & Interests', [
        b.skills.length > 0 ? infoRow('Skills', b.skills.join(' • ')) : null,
        b.hobbies.length > 0 ? infoRow('Hobbies', b.hobbies.join(' • ')) : null,
        b.languages.length > 0 ? infoRow('Languages', b.languages.join(' • ')) : null,
      ]));
    }

    content.push(card('Contact', [
      infoRow('Phone', c.phone),
      infoRow('WhatsApp', c.whatsapp),
      infoRow('Email', c.email),
      infoRow('City', [c.city, c.state].filter(Boolean).join(', ')),
      infoRow('Address', c.address),
    ]));

    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }], margin: [0, 8, 0, 8] });
    content.push({ text: 'Created with ApnaConverter — apnaconverter.com', color: '#9ca3af', fontSize: 8, alignment: 'center' });

    return {
      content: content.filter(Boolean),
      pageSize: 'A4',
      pageMargins: [32, 32, 32, 32] as [number, number, number, number],
      defaultStyle: { font: 'Roboto', fontSize: 10 },
      styles: {
        name: { fontSize: 20, bold: true, color: '#ffffff' },
      },
    };
  }
}
