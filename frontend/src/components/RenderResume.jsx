import React from 'react'
import TemplateATS from './TemplateATS'
import TemplateOne from './TemplateOne'
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree'

// Reactive Resume templates
import TemplateAzurill from './templates/TemplateAzurill'
import TemplateBronzor from './templates/TemplateBronzor'
import TemplateChikorita from './templates/TemplateChikorita'
import TemplateDitgar from './templates/TemplateDitgar'
import TemplateDitto from './templates/TemplateDitto'
import TemplateGengar from './templates/TemplateGengar'
import TemplateGlalie from './templates/TemplateGlalie'
import TemplateKakuna from './templates/TemplateKakuna'
import TemplateLapras from './templates/TemplateLapras'
import TemplateLeafish from './templates/TemplateLeafish'
import TemplateMeowth from './templates/TemplateMeowth'
import TemplateOnyx from './templates/TemplateOnyx'
import TemplatePikachu from './templates/TemplatePikachu'
import TemplateRhyhorn from './templates/TemplateRhyhorn'
import TemplateScizor from './templates/TemplateScizor'

// Shanidhya01 templates
import TemplateShanidhyaModern from './templates/TemplateShanidhyaModern'
import TemplateShanidhyaCreative from './templates/TemplateShanidhyaCreative'
import TemplateShanidhyaExecutive from './templates/TemplateShanidhyaExecutive'
import TemplateShanidhyaMinimal from './templates/TemplateShanidhyaMinimal'
import TemplateShanidhyaTwoColumn from './templates/TemplateShanidhyaTwoColumn'

const RenderResume = ({
  templateId,
  resumeData,
  containerWidth,
  colorPalette,
}) => {
  const palette = colorPalette || resumeData?.template?.colorPalette;

  switch (templateId) {
    // Existing templates
    case "04":
      return <TemplateATS resumeData={resumeData} containerWidth={containerWidth} colorPalette={palette} />
    case "01":
      return <TemplateOne resumeData={resumeData} containerWidth={containerWidth} colorPalette={palette} />
    case "02":
      return <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} colorPalette={palette} />
    case "03":
      return <TemplateThree resumeData={resumeData} containerWidth={containerWidth} colorPalette={palette} />

    // Reactive Resume templates
    case "azurill":
      return <TemplateAzurill resumeData={resumeData} containerWidth={containerWidth} />
    case "bronzor":
      return <TemplateBronzor resumeData={resumeData} containerWidth={containerWidth} />
    case "chikorita":
      return <TemplateChikorita resumeData={resumeData} containerWidth={containerWidth} />
    case "ditgar":
      return <TemplateDitgar resumeData={resumeData} containerWidth={containerWidth} />
    case "ditto":
      return <TemplateDitto resumeData={resumeData} containerWidth={containerWidth} />
    case "gengar":
      return <TemplateGengar resumeData={resumeData} containerWidth={containerWidth} />
    case "glalie":
      return <TemplateGlalie resumeData={resumeData} containerWidth={containerWidth} />
    case "kakuna":
      return <TemplateKakuna resumeData={resumeData} containerWidth={containerWidth} />
    case "lapras":
      return <TemplateLapras resumeData={resumeData} containerWidth={containerWidth} />
    case "leafish":
      return <TemplateLeafish resumeData={resumeData} containerWidth={containerWidth} />
    case "meowth":
      return <TemplateMeowth resumeData={resumeData} containerWidth={containerWidth} />
    case "onyx":
      return <TemplateOnyx resumeData={resumeData} containerWidth={containerWidth} />
    case "pikachu":
      return <TemplatePikachu resumeData={resumeData} containerWidth={containerWidth} />
    case "rhyhorn":
      return <TemplateRhyhorn resumeData={resumeData} containerWidth={containerWidth} />
    case "scizor":
      return <TemplateScizor resumeData={resumeData} containerWidth={containerWidth} />

    // Shanidhya01 templates
    case "shanidhya-modern":
      return <TemplateShanidhyaModern resumeData={resumeData} containerWidth={containerWidth} />
    case "shanidhya-creative":
      return <TemplateShanidhyaCreative resumeData={resumeData} containerWidth={containerWidth} />
    case "shanidhya-executive":
      return <TemplateShanidhyaExecutive resumeData={resumeData} containerWidth={containerWidth} />
    case "shanidhya-minimal":
      return <TemplateShanidhyaMinimal resumeData={resumeData} containerWidth={containerWidth} />
    case "shanidhya-twocolumn":
      return <TemplateShanidhyaTwoColumn resumeData={resumeData} containerWidth={containerWidth} />

    default:
      return <TemplateATS resumeData={resumeData} containerWidth={containerWidth} />
  }
}

export default RenderResume