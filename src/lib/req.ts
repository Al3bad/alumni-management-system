const apiURL = import.meta.env.VITE_API_URL;

export const getAlumniData = async (studentID?: number) => {
  try {
    let endpoint = "/alumni";
    if (studentID) endpoint += `/${studentID}`;
    const res = await fetch(`${apiURL}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
      const resJson = await res.json();
      return resJson.data;
    } else {
      console.log("Error occured in getAllAlumni() function!");
      throw "Somwthing wrong happend! Please try again later!";
    }
  } catch (error: any) {
    throw error;
  }
};

export const getAlumniDocsData = async (studentID: number) => {
  try {
    let endpoint = "/alumni";
    if (studentID) endpoint += `/${studentID}`;
    const res = await fetch(`${apiURL}${endpoint}/docs`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
      const resJson = await res.json();
      return resJson.data;
    } else {
      console.log("Error occured in getAlumniDocsData() function!");
      throw "Somwthing wrong happend! Please try again later!";
    }
  } catch (error: any) {
    throw error;
  }
};
