const apiURL = import.meta.env.VITE_API_URL;

export const getAlumniData = async (studentID?: number) => {
  try {
    console.log(studentID);
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
