export default function updateLocalStorage(storageName, newData) {
    var storage;
    try{
      storage = JSON.parse(localStorage.getItem(storageName))
    }catch (error){
      return ;
    }
    if (Array.isArray(storage)){
        storage = storage.filter((st) => st.uid !== newData.uid);
        storage.push(newData)
        localStorage.setItem(storageName, JSON.stringify(storage));
    }else{
        if (storage.uid === newData.uid){
            localStorage.setItem(storageName, JSON.stringify(newData));
        }
    }
  }