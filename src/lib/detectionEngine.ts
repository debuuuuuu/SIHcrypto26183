import { DetectionPattern } from '@/types/investigation';
import { DEMO_DETECTIONS } from '@/data/demoInvestigation';

export function getAllDetections(): DetectionPattern[] {
  return DEMO_DETECTIONS;
}

export function getDetectionById(id: string): DetectionPattern | undefined {
  return DEMO_DETECTIONS.find((d) => d.id === id);
}

export function getDetectionsForNode(nodeId: string): DetectionPattern[] {
  return DEMO_DETECTIONS.filter((d) => d.affectedNodes.includes(nodeId));
}

export function getDetectionsForEdge(edgeId: string): DetectionPattern[] {
  return DEMO_DETECTIONS.filter((d) => d.affectedEdges.includes(edgeId));
}
