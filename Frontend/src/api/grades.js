import apiClient from "./client";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong'

const request = async (operation) => {
  try {
    const response = await operation()
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const fetchGradesByCourse = (courseSlug) =>
  request(() => apiClient.get(`/grades/courses/${encodeURIComponent(courseSlug)}/grades`))

export const createGrade = (courseSlug, grade, file) => {
  const formData = new FormData()
  formData.append('name', grade.name)
  formData.append('description', grade.description)
  if (file) formData.append('pdf', file)
  return request(() =>
    apiClient.post(`/grades/courses/${encodeURIComponent(courseSlug)}/grades`, formData),
  )
}

export const updateGrade = (id, grade) =>
  request(() => apiClient.put(`/grades/grades/${id}`, grade))

export const deleteGrade = (id) =>
  request(() => apiClient.delete(`/grades/grades/${id}`))

export const deleteGrades = (ids) =>
  request(() => apiClient.delete("/grades/grades", { data: { ids } }))

export const uploadGradePdf = (id, file) => {
  const formData = new FormData()
  formData.append('pdf', file)
  return request(() => apiClient.post(`/grades/grades/${id}/pdf`, formData))
}

export const deleteGradePdf = (id) =>
  request(() => apiClient.delete(`/grades/grades/${id}/pdf`))

export const fileUrl = (url) =>
  url.startsWith("http") ? url : `${apiClient.defaults.baseURL.replace(/\/api$/, "")}${url}`
