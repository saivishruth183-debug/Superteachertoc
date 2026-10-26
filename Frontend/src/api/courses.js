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

export const fetchCourses = () => request(() => apiClient.get("/courses/"))

export const createCourse = (course) => request(() => apiClient.post("/courses/", course))

export const updateCourse = (id, course) => request(() => apiClient.put(`/courses/${id}`, course))

export const deleteCourse = (id) => request(() => apiClient.delete(`/courses/${id}`))

export const deleteCourses = (ids) =>
  request(() => apiClient.delete("/courses/", { data: { ids } }))
