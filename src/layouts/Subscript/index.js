import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import GradientBorder from "examples/GradientBorder";
import { Card, } from "@mui/material";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import VuiInput from "components/VuiInput";
import palette from "assets/theme/base/colors";
import radialGradient from "assets/theme/functions/radialGradient";
import { Table, Progress } from "antd";
import VuiButton from "components/VuiButton";
import { Modal } from "antd";
import borders from "assets/theme/base/borders";
import GetImage from "components/GetImage";

import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { getDatabase, ref as d_ref, onValue, set, push, update, child, remove } from "firebase/database";
import Firebase from "firebase";




const _db = getDatabase();
const formInit = {
  subscription_name: "",  color: "", charge_amount: "", description: "", price: ""
}
function Dashboard() {
  const [modalForm, setModalForm] = useState({ ...formInit });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const columns = [
   
    {
      key: "name",
      title: "Name",
      dataIndex: "subscription_name",
      sortDirections: ['ascend', 'descend',],
      sorter: (a, b, sortOrder) => {
        console.log(sortOrder); return sortOrder == "ascend" ? a.subscription_name > b.subscription_name : a.subscription_name < b.subscription_name
      },
    },
    {
      key: "amount",
      title: "Charge Amount",
      dataIndex: "charge_amount",
      sortDirections: ['ascend', 'descend',],
      sorter: (a, b, sortOrder) => {
        console.log(sortOrder); return sortOrder == "ascend" ? a.charge_amount > b.charge_amount : a.charge_amount < b.charge_amount
      },
    },
    {
      key: "color",
      title: "Color",
      dataIndex: "color",
      render: (color) => (
        <div className="rounded" style={{ background: color, width: 50, height: 20 }} />
      )
    },
    {
      key: "color",
      title: "Description",
      dataIndex: "description",

    },
    {
      key: "price",
      title: "Price",
      dataIndex: "price",
      sortDirections: ['ascend', 'descend',],
      sorter: (a, b, sortOrder) => {
        console.log(sortOrder); return sortOrder == "ascend" ? a.price > b.price : a.price < b.price
      },
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

  const handleDelete = (key) => {
    remove(child(d_ref(_db), "subscriptions/" + key));
    const DeleteRow = rows.filter(row => row.key == key);
    const storage = Firebase.storage;
    const desertRefForImg = ref(storage, DeleteRow.iconNm);

    
  }
  const handleRowClick = (record) => {
    setModalForm(record);
    setIsModalOpen(true);
  }

  const handleSubmit = async (e) => {
   
    let _form = { ...modalForm };
    console.log(_form, "form1")
    try {
      if (!_form.key)
        _form.key = push(child(d_ref(_db), "subscriptions")).key;
      console.log(_form,"_form")
      update(d_ref(_db), {
        [`/subscriptions/${_form.key}`]: {
          subscription_name: _form.subscription_name,
          charge_amount: _form.charge_amount,
          color: _form.color,
          description: _form.description,
          price: _form.price
        }
      });
      setIsModalOpen(false);
      setModalForm(formInit);

    }
    catch (e) {
      console.log(e);
      setIsModalOpen(false)
      setModalForm(formInit);
    }


  }
  useEffect(() => {

    const collection = d_ref(_db, 'subscriptions/');
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


  }, [])

  const onAddClick = (e) => {
    setModalForm(formInit);
    setIsModalOpen(true);
  }
  const InputChange = (e) => {
    let _form = { ...modalForm };
    _form[e.target.name] = e.target.value;
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
                Table of Subscriptions
              </VuiTypography>
              <VuiButton variant="gradient" color="primary" onClick={onAddClick}><Icon>edit</Icon>Add</VuiButton>
            </VuiBox>
            <Modal style={{ background: "none" }} open={isModalOpen} closable={false} footer={null} >



              <div className="bg-c-dark round-lg p-5">
                <h3 className="text-light">
                  Subscription Form
                </h3>
                <div className="">
                  <VuiBox component="form" role="form">
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
                        <VuiInput type="text" name="subscription_name" value={modalForm.subscription_name} onChange={InputChange} placeholder="" fontWeight="500" />
                      </GradientBorder>
                    </VuiBox>
                    <VuiBox mb={2}>
                      <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                          charge_amount
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
                        <VuiInput type="number" name="charge_amount" value={modalForm.charge_amount} onChange={InputChange} placeholder="" fontWeight="500" />
                      </GradientBorder>
                    </VuiBox>
                    <VuiBox mb={2}>
                      <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                          Price
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
                        <VuiInput type="number" name="price" value={modalForm.price} onChange={InputChange} placeholder="" fontWeight="500" />
                      </GradientBorder>
                    </VuiBox>
                    
                    <VuiBox mb={2}>
                      <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                          Color
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
                        <VuiInput type="color" name="color" value={modalForm.color} onChange={InputChange} placeholder="" fontWeight="500" />
                      </GradientBorder>
                    </VuiBox>
                    <VuiBox mb={2}>
                      <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                          Description
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
                        <VuiInput name="description" value={modalForm.description} onChange={InputChange} multiline rows={3} placeholder="" fontWeight="500" />
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
              {
                loadingState && <div className="d-flex justify-content-center" style={{ position: "absolute", top: 0, background: "rgba(0,0,0,0.5)", color: "white", width: "100%", height: "100%", padding: "20%", paddingTop: "30%", alignItems: "center" }}>
                  <Progress percent={percent} type="circle" strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
                </div>
              }
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

        {/* <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={8}>
            <Projects />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid> */}
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
