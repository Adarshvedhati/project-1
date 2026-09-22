import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { CASE_STUDIES, type CaseStudyDetail } from "../../../mocks/caseStudies.mock";

/** Case Studies module (SRS section 3, P1). */
export async function listCaseStudies(): Promise<CaseStudyDetail[]> {
  try {
    return await apiClient.get<CaseStudyDetail[]>(ENDPOINTS.caseStudies, { auth: false });
  } catch {
    return CASE_STUDIES;
  }
}

export async function getCaseStudy(id: string): Promise<CaseStudyDetail | undefined> {
  try {
    return await apiClient.get<CaseStudyDetail>(ENDPOINTS.caseStudy(id), { auth: false });
  } catch {
    return CASE_STUDIES.find((cs) => cs.id === id);
  }
}
