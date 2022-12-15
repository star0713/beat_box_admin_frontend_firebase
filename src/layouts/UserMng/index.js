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
import Firebase from "firebase";
import {getFunctions, httpsCallable, connectFunctionsEmulator} from "firebase/functions";

const formInit = {
  track_name: "", track_file: "", track_bpm: "", track_genre: "", track_artist: "", amount_of_credits: ""
}
const functions = getFunctions(Firebase.app);
// connectFunctionsEmulator(functions, "localhost", 5001);
function Dashboard() {
 
  const [rows, setRows] = useState([]);
 
  const columns = [
    {
      key: "photoURL",
      title: "Photo",
      dataIndex: "photoURL",
      render: (text) => (<img src={text} width="50" height={50} className="rounded " style={{ marginLeft: 35 }} />)

    },
    {
      key: "name",
      title: "Name",
      dataIndex: "displayName",
      sortDirections: ['ascend', 'descend',],
      sorter: (a, b, sortOrder) => {
        console.log(sortOrder); return sortOrder == "ascend" ? a.displayName > b.displayName : a.displayName < b.displayName
      },
    },

    {
      key: "Email",
      title: "Email",
      dataIndex: "email",
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b, sortOrder) => {
        return sortOrder == "ascend" ? a.email > b.email : a.email < b.email
      },
    },
    {
      key: "emailVerified",
      title: "EmailVerified",
      dataIndex: "emailVerified",
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b, sortOrder) => {
        return sortOrder == "ascend" ? a.emailVerified > b.emailVerified : a.emailVerified < b.emailVerified
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

  const handleDelete = async(key) => {
    const getUsersRequest = httpsCallable(functions,"deletUser?userid="+key);
    const resp = await getUsersRequest();
    getUsers();
  }
  const handleRowClick = (record) => {
   
  }
  const getUsers = async()=>{
    const getUsersRequest = httpsCallable(functions,"getUsers");
    const resp = await getUsersRequest();
    console.log(resp,"resp")
    let userlist; 
    if(resp.data){

      userlist = resp.data;
      userlist.forEach(element => {
        element.key = element.uid;
        
      });
      setRows(userlist);
    }

  }

 
  useEffect(() => {
    getUsers();
  }, [])
  
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
            </VuiBox>
            
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
