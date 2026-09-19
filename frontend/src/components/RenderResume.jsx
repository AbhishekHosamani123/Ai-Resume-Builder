import React from 'react'
import TemplateATS from './TemplateATS'
import TemplateOne from './TemplateOne'
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree'

const RenderResume = ({
  templateId,
  resumeData,
  containerWidth,
}) => {
  switch (templateId) {
    case "04":
      return (
        <TemplateATS resumeData={resumeData} containerWidth={containerWidth} />
      )
    case "01":
      return (
        <TemplateOne resumeData={resumeData} containerWidth={containerWidth} />
      )
      case "02":
        return (
          <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} />
        )
      case "03":
        return (
          <TemplateThree resumeData={resumeData} containerWidth={containerWidth} />
        )
        default:
            return (
                <TemplateOne resumeData={resumeData} containerWidth={containerWidth} />
            )
  }
}

export default RenderResume