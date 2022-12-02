import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import GradientBorder from "examples/GradientBorder";
import { Card, LinearProgress, Stack } from "@mui/material";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import VuiInput from "components/VuiInput";
import Select from "react-select";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import palette from "assets/theme/base/colors";
import radialGradient from "assets/theme/functions/radialGradient";
import { Table, Spin } from "antd";

import { Modal } from "antd";
import borders from "assets/theme/base/borders";


import GetImage from "components/GetImage";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { getDatabase, ref as d_ref, onValue, set, push, update, child, remove } from "firebase/database";
import Firebase from "firebase";
const _db = getDatabase();
const formInit = {
  track_name: "", track_file: "", track_bpm: "", track_genre: "", track_artist: "", amount_of_credits: ""
}
function Dashboard() {
  const [modalForm, setModalForm] = useState({ ...formInit });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [rows, setRows] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const columns = [
    {
      key: "Thumbnail",
      title: "Thumbnail",
      dataIndex: "track_thumbnail",
      sortDirections: ['ascend', 'descend', 'ascend'],
      sortDirections: ['ascend', 'descend', 'ascend'],

      render: (text) => (<img src={text} width="50" height={50} className="rounded " style={{ marginLeft: 35 }} />)

    },
    {
      key: "name",
      title: "name",
      dataIndex: "track_name",
      sortDirections: ['ascend', 'descend',],
      sorter: (a, b, sortOrder) => {
        console.log(sortOrder); return sortOrder == "ascend" ? a.track_name > b.track_name : a.track_name < b.track_name
      },
    },

    {
      key: "Description",
      title: "Description",
      dataIndex: "track_genre",
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b, sortOrder) => {
        return sortOrder == "ascend" ? a.genre > b.genre : a.genre < b.genre
      },
    },
    {
      key: "Bpm",
      title: "BPM",
      dataIndex: "track_bpm",
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b, sortOrder) => {
        return sortOrder == "ascend" ? a.track_bpm > b.track_bpm : a.track_bpm < b.track_bpm
      },
    },
    {
      key: "artist",
      title: "Artist",
      dataIndex: "track_artist",
      sortDirections: ['ascend', 'descend', 'ascend'],
      // sorter: (a, b, sortOrder) => {
      //   if (artists.length > 0) {
        
      //     return sortOrder == "ascend" ? a.name > b.name : a.name < b.name
      //   }
      //   return sortOrder == "ascend" ? a.name > b.name : a.name < b.name
      // },
      render: (text) => {
        console.log(text,artists.find(artist=>artist.value == text),"artist")
        return artists.find(artist=>artist.value == text)?.label
      }

    },
    {
      key: "Delete",
      title: "Delete",
      dataIndex: "key",
      sortDirections: ['ascend', 'descend', 'ascend'],
      sortDirections: ['ascend', 'descend', 'ascend'],

      render: (text) => (<VuiButton color="warning" onClick={e => { e.stopPropagation(); handleDelete(text) }}>delete</VuiButton>)

    },


  ];
  console.log()
  const handleDelete = (key) => {
    remove(child(d_ref(_db), "beats/" + key));
    const DeleteRow = rows.filter(row => row.key == key);
    const storage = Firebase.storage;
    const desertRefForImg = ref(storage, DeleteRow.imageNm);
    const desertRefForBeat = ref(storage, DeleteRow.beatFileNm);
    try {
      deleteObject(desertRefForBeat);
      deleteObject(desertRefForImg);
    } catch (e) {

    }
  }
  const handleRowClick = (record) => {
    let _modalForm = record;
    _modalForm.track_artist = artists.find(artist=>artist.value==record.track_artist);

    setModalForm(_modalForm);
    setIsModalOpen(true);
    setPreviewImage(record.track_thumbnail)
  }


  const handleSubmit = async (e) => {
    let _form = { ...modalForm };
    let nowtime = new Date();
    let promises = [];
    setLoadingState(true);
    if (_form.beatFile) {
      promises.push(
        new Promise((resolve, reject) => {
          const storage = Firebase.storage;
          if (_form.key && _form.beatFileNm) {

            const desertRef = ref(storage, _form.beatFileNm);
            try {
              deleteObject(desertRef);
            } catch (e) {

            }
          }
          let ext = _form.beatFile.name.split(".").pop();
          _form.beatFileNm = `/files/beatfile/${nowtime.getTime()}.${ext}`;

          const storeRef = ref(storage, `files/beatfile/${nowtime.getTime()}.${ext}`);
          const uploadTask = uploadBytesResumable(storeRef, _form.beatFile);
          console.log(storeRef, "beatfile", _form.beatFile)
          uploadTask.on("state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            },
            (error) => {
              console.error("Upload was failed.");
              reject();
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                _form.track_file = downloadURL;
                console.log("Upload was succeeded!", downloadURL);
                resolve();
              })
            }
          )
        })
      )
    }
    if (_form.beatImage) {
      promises.push(
        new Promise((resolve, reject) => {
          const storage = Firebase.storage;
          if (_form.key && _form.imageNm) {

            const desertRef = ref(storage, _form.imageNm);
            try {
              deleteObject(desertRef);
            } catch (e) {

            }
          }
          let ext = _form.beatImage.name.split(".").pop();

          _form.imageNm = `/files/images/${nowtime.getTime()}.${ext}`;
          const storeRef = ref(storage, `files/images/${nowtime.getTime()}.${ext}`);
          const uploadTask = uploadBytesResumable(storeRef, _form.beatImage);
          uploadTask.on("state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            },
            (error) => {
              console.error("Upload was failed.");
              reject();
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                _form.track_thumbnail = downloadURL;
                console.log("Upload was succeeded!", downloadURL);
                resolve();
              })
            }
          )
        })
      )
    }
    try {

      if (promises.length > 0) {
        await Promise.all(promises);

      }
      console.log(_form, "form")
      if (!_form.key)
        _form.key = push(child(d_ref(_db), "beats")).key;
      console.log(_form,"secondFrom")
      update(d_ref(_db), {
        [`/beats/${_form.key}`]: {
          track_genre:_form.track_genre,
          track_name: _form.track_name,
          track_thumbnail: _form.track_thumbnail,
          track_file: _form.track_file,
          imageNm: _form.imageNm,
          beatFileNm: _form.beatFileNm,
          track_bpm: _form.track_bpm,
          track_artist: _form.track_artist.value,
          amount_of_credits: _form.amount_of_credits,
        }
      });
      setIsModalOpen(false);
      setModalForm(formInit);
      setLoadingState(false)
    }
    catch (e) {
      console.error(e,"e")
      setIsModalOpen(false)
      setModalForm(formInit);
      setLoadingState(false)
    }


  }
  useEffect(() => {
    // Firebase.auth.getUsers().then((res)=>{
    //   console.log(res,"getUsers")
    // })
 
    const collection = d_ref(_db, 'beats/');
    onValue(collection, (snapshot) => {
      const data = snapshot.val();
      let beatData = [];
      if (data === null) {
        setRows([])
        return;
      }
      Object.keys(data).map(key => {
        beatData.push(
          {
            ...data[key],
            key: key
          }
        )
      });
      setRows(beatData);


    })
    const artCollection = d_ref(_db, "artists/");
    onValue(artCollection, (snapshot) => {
      const data = snapshot.val();

      let artData = [];

      if (data === null) {
        setArtists([]);
        return;
      }
      console.log(data, Object.keys(data), "test")
      Object.keys(data).map(key => {
        artData.push({
          value: key,
          label: data[key].name,
        });

      })
      //console.log(artData,"aaaaa")
      setArtists(artData);

      const usersCollection = d_ref(_db,"/users");
      onValue(usersCollection,(snapshot)=>{
        console.log(snapshot.val(),"users")
      })



    })

    // const newId = push(child(d_ref(_db),"beats")).key;
    // update(d_ref(_db),{["/beats/"+newId]:{
    //   name:"dfd", desription:"dsaa"}
    // })

  }, [])
  console.log(Firebase.auth,"auth")
  console.log(modalForm,"form---")
  console.log(artists, "artdatastate")
  const handlePreview = async (file) => {
    if (!file.url) {
      file.preview = await GetImage(file);
      setPreviewImage(file.preview)
    }

  }
  const onAddClick = (e) => {
    setModalForm(formInit);
    setPreviewImage(null)
    setIsModalOpen(true);
  }
  const InputChange = (e) => {
    let _form = { ...modalForm };
    _form[e.target.name] = e.target.value;
    setModalForm(_form);
  }

  const handleImageFile = e => {
    if (!e.target.files[0]) return;
    handlePreview(e.target.files[0]);
    let _form = { ...modalForm };
    _form["beatImage"] = e.target.files[0];
    setModalForm(_form);
  }
  const handleBeatFile = e => {
    if (!e.target.files[0]) return;
    let _form = { ...modalForm };
    _form["beatFile"] = e.target.files[0];

    console.log(_form)
    setModalForm(_form);

  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Beats table
              </VuiTypography>
              <VuiButton variant="gradient" color="primary" onClick={onAddClick}><Icon>edit</Icon>Add</VuiButton>
            </VuiBox>


            <Modal style={{ background: "none" }} open={isModalOpen} closable={false} footer={null} >
              <Spin spinning={loadingState}>
                <div className="bg-c-dark round-lg p-5">
                  <h3 className="text-light">
                    Beat info
                  </h3>
                  <div className="">
                    <VuiBox component="form" role="form">
                      {/* track_name */}
                      <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Name
                          </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                          minWidth="100%"
                          padding="1px"
                          borderRadius={borders.borderRadius.lg}
                          backgroundImage={radialGradient(
                            palette.gradients.borderLight.main,
                            palette.gradients.borderLight.state,
                            palette.gradients.borderLight.angle
                          )}
                        >
                          <VuiInput type="text" name="track_name" value={modalForm.track_name} onChange={InputChange} placeholder="Name of Beat file..." fontWeight="500" />
                        </GradientBorder>
                      </VuiBox>
                      {/* upload beatfile */}
                      <VuiBox mb={2}>

                        <label className="btn btn-light text-dark">

                          Beat file upload
                          <input type="file" onChange={handleBeatFile} className="d-none" />


                        </label>
                        <span className="text-white m-3">
                          {modalForm.beatFileNm}
                        </span>



                      </VuiBox>

                      {/* upload thumbnail */}
                      <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Image
                          </VuiTypography>
                        </VuiBox>

                        <div className="d-flex">
                          <div className="  rounded d-flex flex-wrap align-content-center justify-content-center" style={{ width: 100, height: 100, border: "2px dashed grey" }}>
                            <label className="d-block">
                              <input type="file" onChange={handleImageFile} className="d-none" />
                              <h3 className="p-3 pb-0 pt-0">+</h3>
                              <h6>UPLOAD</h6>
                            </label>
                          </div>
                          <div className="border border-secondary p-1 ml-1 rounded" style={{ width: 100, height: 100, marginLeft: 5 }}>

                            {previewImage && <img src={previewImage} width="100%" height="100%" />}
                          </div>

                        </div>




                      </VuiBox>
                      {/* track_genre */}
                      <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Genre
                          </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                          minWidth="100%"
                          padding="1px"
                          borderRadius={borders.borderRadius.lg}
                          backgroundImage={radialGradient(
                            palette.gradients.borderLight.main,
                            palette.gradients.borderLight.state,
                            palette.gradients.borderLight.angle
                          )}
                        >
                          <VuiInput type="text" name="track_genre" value={modalForm.track_genre} onChange={InputChange} placeholder="Genre of Beat file..." fontWeight="500" />
                        </GradientBorder>
                      </VuiBox>
                      {/* track_bpm */}
                      <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Byte per minute
                          </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                          minWidth="100%"
                          padding="1px"
                          borderRadius={borders.borderRadius.lg}
                          backgroundImage={radialGradient(
                            palette.gradients.borderLight.main,
                            palette.gradients.borderLight.state,
                            palette.gradients.borderLight.angle
                          )}
                        >
                          <VuiInput type="number" name="track_bpm" value={modalForm.track_bpm} onChange={InputChange} placeholder="Bpm of Beat file..." fontWeight="500" />
                        </GradientBorder>
                      </VuiBox>

                      {/* track aritist */}
                      <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Byte per minute
                          </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                          minWidth="100%"
                          padding="1px"
                          borderRadius={borders.borderRadius.lg}
                          backgroundImage={radialGradient(
                            palette.gradients.borderLight.main,
                            palette.gradients.borderLight.state,
                            palette.gradients.borderLight.angle
                          )}
                        >
                          <Select
                            placeholder="Select artist"
                            options={artists}

                            value={modalForm.track_artist}
                            onChange={(val) => {
                              InputChange({ target: { name: "track_artist", value: val } })
                            }}
                            styles={{
                              control: (styles) => (
                                {
                                  ...styles, borderRadius: 15, background: "hsl(227deg 46% 14%) !important",
                                  borderColor: "grey"
                                }
                              )

                            }
                            }

                          />
                        </GradientBorder>
                      </VuiBox>


                      {/* track amount of credits */}
                      <VuiBox mb={2}>
                        <VuiBox mb={1} ml={0.5}>
                          <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Amount of Credits
                          </VuiTypography>
                        </VuiBox>
                        <GradientBorder
                          minWidth="100%"
                          padding="1px"
                          borderRadius={borders.borderRadius.lg}
                          backgroundImage={radialGradient(
                            palette.gradients.borderLight.main,
                            palette.gradients.borderLight.state,
                            palette.gradients.borderLight.angle
                          )}
                        >
                          <VuiInput type="number" name="amount_of_credits" value={modalForm.amount_of_credits} onChange={InputChange} placeholder="Bpm of Beat file..." fontWeight="500" />
                        </GradientBorder>
                      </VuiBox>


                      <VuiBox mt={4} mb={1}>
                        <div className="row">
                          <div className="col-md-6 p-2">
                            <VuiButton color="info" fullWidth onClick={handleSubmit}>
                              Submit
                            </VuiButton>
                          </div>

                          <div className="col-md-6 p-2">
                            <VuiButton color="info" fullWidth onClick={e => setIsModalOpen(false)}>
                              cancel
                            </VuiButton>
                          </div>

                        </div>
                      </VuiBox>

                    </VuiBox>
                  </div>
                </div>
              </Spin>
            </Modal>
            <VuiBox
              sx={{
                "& th": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                },
              }}
            >
              <Table columns={columns} dataSource={rows} pagination={{ position: ["topLeft", "bottomLeft"] }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: e => {
                      handleRowClick(record);
                    }
                  }
                }}
              />
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>
      <Footer />

    </DashboardLayout>

  );
}

export default Dashboard;
