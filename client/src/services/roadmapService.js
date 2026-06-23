import api from './api';

export async function generateRoadmap(data) {
    const res = await api.post('/api/roadmaps/generate', data);
    return res.data;
}

export async function saveRoadmap(data) {
    const res = await api.post('/api/roadmaps', data);
    return res.data;
}

export async function fetchMyRoadmaps() {
    const res = await api.get('/api/roadmaps');
    return res.data;
}
export async function fetchRoadmapById(id) {
    const res = await api.get(`/api/roadmaps/${id}`);
    return res.data;
}
export async function deleteRoadmap(id) {
    const res = await api.delete(`/api/roadmaps/${id}`);
    return res.data;
}
export async function updateTaskStatus(taskId, status) {
    const res = await api.patch(`/api/roadmaps/tasks/${taskId}`, { status });
    return res.data;
}