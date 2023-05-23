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

export const addNewAlumniRecord = async (formData: {
  studentID: string;
  fname: string;
  lname: string;
}) => {
  console.log(formData);
  try {
    const res = await fetch(`${apiURL}/alumni`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const resJson = await res.json();
    if (res.status === 201) {
      return resJson.data;
    } else if (resJson.error) {
      throw resJson.error.msg;
    } else {
      console.log("Error occured in addNewAlumniRecord() function!");
      throw "Somwthing wrong happend! Please try again later!";
    }
  } catch (error: any) {
    throw error;
  }
};
