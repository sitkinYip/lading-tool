import myAxios from "../utils/myAxios";

const getPage = (params:object) => {
  return myAxios({
    url:'/page',
    method:'GET',
    params
  })
}

export default {
  getPage
}