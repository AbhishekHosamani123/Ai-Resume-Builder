import { Input } from "./Inputs";
import { RatingInput } from "./ResumeSection";
import { Plus, Trash2, SkipForward } from "lucide-react";
import { BulletPointsField } from "./BulletPointsField";
import {
  commonStyles,
  additionalInfoStyles,
  certificationInfoStyles,
  contactInfoStyles,
  educationDetailsStyles,
  profileInfoStyles,
  projectDetailStyles,
  skillsInfoStyles,
  workExperienceStyles
} from "../assets/dummystyle";

// AdditionalInfoForm Component
export const AdditionalInfoForm = ({ languages, interests, updateArrayItem, addArrayItem, removeArrayItem }) => {
  return (
    <div className={additionalInfoStyles.container}>
      <h2 className={additionalInfoStyles.heading}>Additional Information</h2>

      {/* Languages Section */}
      <div className="mb-10">
        <h3 className={additionalInfoStyles.sectionHeading}>
          <div className={additionalInfoStyles.dotViolet}></div>
          Languages
        </h3>
        <div className="space-y-6">
          {languages?.map((lang, index) => (
            <div key={index} className={additionalInfoStyles.languageItem}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <Input
                  label="Language"
                  placeholder="e.g. English"
                  value={lang.name || ""}
                  onChange={({ target }) => updateArrayItem("languages", index, "name", target.value)}
                />
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Proficiency</label>
                  <RatingInput
                    value={lang.progress || 0}
                    total={5}
                    color="#8b5cf6"
                    bgColor="#e2e8f0"
                    onChange={(value) => updateArrayItem("languages", index, "progress", value)}
                  />
                </div>
              </div>
              {languages.length > 1 && (
                <button
                  type="button"
                  className={commonStyles.trashButton}
                  onClick={() => removeArrayItem("languages", index)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${additionalInfoStyles.addButtonLanguage}`}
            onClick={() => addArrayItem("languages", { name: "", progress: 0 })}
          >
            <Plus size={16} /> Add Language
          </button>
        </div>
      </div>

      {/* Interests Section */}
      <div className="mb-6">
        <h3 className={additionalInfoStyles.sectionHeading}>
          <div className={additionalInfoStyles.dotOrange}></div>
          Interests
        </h3>
        <div className="space-y-4">
          {interests?.map((interest, index) => (
            <div key={index} className={additionalInfoStyles.interestItem}>
              <Input
                placeholder="e.g. Reading, Photography"
                value={interest || ""}
                onChange={({ target }) => updateArrayItem("interests", index, null, target.value)}
              />
              {interests.length > 1 && (
                <button
                  type="button"
                  className={commonStyles.trashButton}
                  onClick={() => removeArrayItem("interests", index)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

// CertificationInfoForm Component
export const CertificationInfoForm = ({ certifications = [], updateArrayItem, addArrayItem, removeArrayItem, onSkip }) => {
  return (
    <div className={certificationInfoStyles.container}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <h2 className={certificationInfoStyles.heading} style={{ marginBottom: 0 }}>Certifications</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Optional
          </span>
        </div>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50/60 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Skip this section"
          >
            <SkipForward size={13} />
            Skip this section
          </button>
        )}
      </div>

      <div className="space-y-6 mb-6">
        {(!certifications || certifications.length === 0) ? (
          <div className="text-center py-8 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 mb-3">No certifications added. This section is completely optional.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className={`${commonStyles.addButtonBase} ${certificationInfoStyles.addButton}`}
                onClick={() =>
                  addArrayItem({
                    title: "",
                    issuer: "",
                    year: "",
                  })
                }
              >
                <Plus size={16} />
                Add Certification
              </button>
              {onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Skip Section →
                </button>
              )}
            </div>
          </div>
        ) : (
          certifications.map((cert, index) => (
            <div key={index} className={certificationInfoStyles.item}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Certificate Title"
                  placeholder="Full Stack Web Developer"
                  value={cert.title || ""}
                  onChange={({ target }) => updateArrayItem(index, "title", target.value)}
                />

                <Input
                  label="Issuer"
                  placeholder="Coursera / Google / etc."
                  value={cert.issuer || ""}
                  onChange={({ target }) => updateArrayItem(index, "issuer", target.value)}
                />

                <Input
                  label="Year"
                  type="month"
                  placeholder="2024-01"
                  value={cert.year && cert.year.length === 4 ? `${cert.year}-01` : cert.year || ""}
                  onChange={({ target }) => updateArrayItem(index, "year", target.value)}
                />
              </div>

              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
                title="Remove certification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

        {certifications && certifications.length > 0 && (
          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${certificationInfoStyles.addButton}`}
            onClick={() =>
              addArrayItem({
                title: "",
                issuer: "",
                year: "",
              })
            }
          >
            <Plus size={16} />
            Add Certification
          </button>
        )}
      </div>
    </div>
  );
};

// ContactInfoForm Component
export const ContactInfoForm = ({ contactInfo, updateSection }) => {
  return (
    <div className={contactInfoStyles.container}>
      <h2 className={contactInfoStyles.heading}>Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Address"
            placeholder="Short Address"
            value={contactInfo.location || ""}
            onChange={({ target }) => updateSection("location", target.value)}
          />
        </div>

        <Input
          label="Email"
          placeholder="john@example.com"
          type="email"
          value={contactInfo.email || ""}
          onChange={({ target }) => updateSection("email", target.value)}
        />

        <Input
          label="Phone Number"
          placeholder="1234567890"
          value={contactInfo.phone || ""}
          onChange={({ target }) => updateSection("phone", target.value)}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          value={contactInfo.linkedin || ""}
          onChange={({ target }) => updateSection("linkedin", target.value)}
        />

        <Input
          label="GitHub"
          placeholder="https://github.com/username"
          value={contactInfo.github || ""}
          onChange={({ target }) => updateSection("github", target.value)}
        />

        <div className="md:col-span-2">
          <Input
            label="Portfolio / Website"
            placeholder="https://yourwebsite.com"
            value={contactInfo.website || ""}
            onChange={({ target }) => updateSection("website", target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// EducationDetailsForm Component
export const EducationDetailsForm = ({ educationInfo, updateArrayItem, addArrayItem, removeArrayItem }) => {
  return (
    <div className={educationDetailsStyles.container}>
      <h2 className={educationDetailsStyles.heading}>Education</h2>
      <div className="space-y-6 mb-6">
        {educationInfo.map((education, index) => (
          <div key={index} className={educationDetailsStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Degree"
                placeholder="BTech in Computer Science"
                value={education.degree || ""}
                onChange={({ target }) => updateArrayItem(index, "degree", target.value)}
              />

              <Input
                label="Institution"
                placeholder="XYZ University"
                value={education.institution || ""}
                onChange={({ target }) => updateArrayItem(index, "institution", target.value)}
              />

              <Input
                label="Start Date"
                type="month"
                value={education.startDate && education.startDate.length === 4 ? `${education.startDate}-01` : education.startDate || ""}
                onChange={({ target }) => updateArrayItem(index, "startDate", target.value)}
              />

              <Input
                label="End Date"
                type="month"
                value={education.endDate && education.endDate.length === 4 ? `${education.endDate}-01` : education.endDate || ""}
                onChange={({ target }) => updateArrayItem(index, "endDate", target.value)}
              />
            </div>
            {educationInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${educationDetailsStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              degree: "",
              institution: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          <Plus size={16} /> Add Education
        </button>
      </div>
    </div>
  );
};

// ProfileInfoForm Component
export const ProfileInfoForm = ({ profileData, updateSection, onEnhanceSummary }) => {
  return (
    <div className={profileInfoStyles.container}>
      <h2 className={profileInfoStyles.heading}>Personal Information</h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
          />

          <Input
            label="Designation"
            placeholder="Full Stack Developer"
            value={profileData.designation || ""}
            onChange={({ target }) => updateSection("designation", target.value)}
          />

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-slate-700">Summary</label>
              {typeof onEnhanceSummary === 'function' && (
                <button
                  type="button"
                  onClick={onEnhanceSummary}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  AI Enhance
                </button>
              )}
            </div>
            <textarea
              className={profileInfoStyles.textarea}
              rows={4}
              placeholder="Short introduction about yourself"
              value={profileData.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ProjectDetailForm Component
export const ProjectDetailForm = ({ projectInfo = [], updateArrayItem, addArrayItem, removeArrayItem, onEnhanceProjectDescription, onSkip }) => {
  return (
    <div className={projectDetailStyles.container}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <h2 className={projectDetailStyles.heading} style={{ marginBottom: 0 }}>Projects</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Optional
          </span>
        </div>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50/60 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Skip this section"
          >
            <SkipForward size={13} />
            Skip this section
          </button>
        )}
      </div>

      <div className="space-y-6 mb-6">
        {(!projectInfo || projectInfo.length === 0) ? (
          <div className="text-center py-8 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 mb-3">No projects added. This section is completely optional.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className={`${commonStyles.addButtonBase} ${projectDetailStyles.addButton}`}
                onClick={() =>
                  addArrayItem({
                    title: "",
                    description: "",
                    github: "",
                    liveDemo: "",
                  })
                }
              >
                <Plus size={16} />
                Add Project
              </button>
              {onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Skip Section →
                </button>
              )}
            </div>
          </div>
        ) : (
          projectInfo.map((project, index) => (
            <div key={index} className={projectDetailStyles.item}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Project Title"
                    placeholder="Portfolio Website"
                    value={project.title || ""}
                    onChange={({ target }) => updateArrayItem(index, "title", target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <BulletPointsField
                    label="Description"
                    value={project.description || ""}
                    onChange={(val) => updateArrayItem(index, "description", val)}
                    onEnhance={typeof onEnhanceProjectDescription === 'function' ? () => onEnhanceProjectDescription(index) : null}
                    placeholder="Describe your project highlights, features, and technologies used..."
                    category="project"
                  />
                </div>

                <Input
                  label="GitHub Link"
                  placeholder="https://github.com/username/project"
                  value={project.github || ""}
                  onChange={({ target }) => updateArrayItem(index, "github", target.value)}
                />

                <Input
                  label="Live Demo URL"
                  placeholder="https://yourproject.live"
                  value={project.liveDemo || ""}
                  onChange={({ target }) => updateArrayItem(index, "liveDemo", target.value)}
                />
              </div>

              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
                title="Remove project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

        {projectInfo && projectInfo.length > 0 && (
          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${projectDetailStyles.addButton}`}
            onClick={() =>
              addArrayItem({
                title: "",
                description: "",
                github: "",
                liveDemo: "",
              })
            }
          >
            <Plus size={16} />
            Add Project
          </button>
        )}
      </div>
    </div>
  );
};

// SkillsInfoForm Component
export const SkillsInfoForm = ({ skillsInfo, updateArrayItem, addArrayItem, removeArrayItem }) => {
  return (
    <div className={skillsInfoStyles.container}>
      <h2 className={skillsInfoStyles.heading}>Skills</h2>
      <div className="space-y-6 mb-6">
        {skillsInfo.map((skill, index) => (
          <div key={index} className={skillsInfoStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Skill Name"
                placeholder="JavaScript"
                value={skill.name || ""}
                onChange={({ target }) => updateArrayItem(index, "name", target.value)}
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Proficiency ({skill.progress ? Math.round(skill.progress / 20) : 0}/5)
                </label>
                <div className="mt-2">
                  <RatingInput
                    value={skill.progress || 0}
                    total={5}
                    color="#f59e0b"
                    bgColor="#e2e8f0"
                    onChange={(newValue) => updateArrayItem(index, "progress", newValue)}
                  />
                </div>
              </div>
            </div>

            {skillsInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${skillsInfoStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              name: "",
              progress: 0,
            })
          }
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>
    </div>
  );
};

// WorkExperienceForm Component
export const WorkExperienceForm = ({ workExperience = [], updateArrayItem, addArrayItem, removeArrayItem, onEnhanceDescription, onSkip }) => {
  return (
    <div className={workExperienceStyles.container}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <h2 className={workExperienceStyles.heading} style={{ marginBottom: 0 }}>Work Experience</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Optional
          </span>
        </div>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50/60 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Skip this section"
          >
            <SkipForward size={13} />
            Skip this section
          </button>
        )}
      </div>

      <div className="space-y-6 mb-6">
        {(!workExperience || workExperience.length === 0) ? (
          <div className="text-center py-8 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 mb-3">No work experience added. This section is completely optional for students, freshers, or career changers.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className={`${commonStyles.addButtonBase} ${workExperienceStyles.addButton}`}
                onClick={() =>
                  addArrayItem({
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
              >
                <Plus size={16} />
                Add Work Experience
              </button>
              {onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Skip Section →
                </button>
              )}
            </div>
          </div>
        ) : (
          workExperience.map((experience, index) => (
            <div key={index} className={workExperienceStyles.item}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company"
                  placeholder="ABC Corp"
                  value={experience.company || ""}
                  onChange={({ target }) => updateArrayItem(index, "company", target.value)}
                />

                <Input
                  label="Role"
                  placeholder="Frontend Developer"
                  value={experience.role || ""}
                  onChange={({ target }) => updateArrayItem(index, "role", target.value)}
                />

                <Input
                  label="Start Date"
                  type="month"
                  value={experience.startDate && experience.startDate.length === 4 ? `${experience.startDate}-01` : experience.startDate || ""}
                  onChange={({ target }) => updateArrayItem(index, "startDate", target.value)}
                />

                <Input
                  label="End Date"
                  type="month"
                  value={experience.endDate && experience.endDate.length === 4 ? `${experience.endDate}-01` : experience.endDate || ""}
                  onChange={({ target }) => updateArrayItem(index, "endDate", target.value)}
                />
              </div>

              <div className="mt-6">
                <BulletPointsField
                  label="Description"
                  value={experience.description || ""}
                  onChange={(val) => updateArrayItem(index, "description", val)}
                  onEnhance={typeof onEnhanceDescription === 'function' ? () => onEnhanceDescription(index) : null}
                  placeholder="Describe your key roles, responsibilities, and achievements..."
                  category="experience"
                />
              </div>

              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
                title="Remove experience"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

        {workExperience && workExperience.length > 0 && (
          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${workExperienceStyles.addButton}`}
            onClick={() =>
              addArrayItem({
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
              })
            }
          >
            <Plus size={16} />
            Add Work Experience
          </button>
        )}
      </div>
    </div>
  );
};