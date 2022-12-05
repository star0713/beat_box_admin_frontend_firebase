import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import GradientBorder from "examples/GradientBorder";
import { Card, LinearProgress, Stack } from "@mui/material";
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
	name: "", description: "", imageNm: ""
}
function Dashboard() {
	const [percent, setPercent] = useState(0);
	const [modalForm, setModalForm] = useState({ ...formInit });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [rows, setRows] = useState([]);
	const [loadingState, setLoadingState] = useState(false);
	const columns = [
		{
			key: "Image",
			title: "Image",
			dataIndex: "ImageURL",
			render: (text) => (<img src={text} width="50" height={50} className="rounded " style={{ marginLeft: 35 }} />)
		},
		{
			key: "name",
			title: "name",
			dataIndex: "name",
			sortDirections: ['ascend', 'descend',],
			sorter: (a, b, sortOrder) => {
				console.log(sortOrder); return sortOrder == "ascend" ? a.name > b.name : a.name < b.name
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
		remove(child(d_ref(_db), "artists/" + key));
		const DeleteRow = rows.filter(row => row.key == key);
		const storage = Firebase.storage;
		const desertRefForImg = ref(storage, DeleteRow.imageNm);

		try {
			deleteObject(desertRefForImg);
		} catch (e) {

		}
	}
	const handleRowClick = (record) => {
		setModalForm(record);
		setIsModalOpen(true);
		setPreviewImage(record.ImageURL)
	}


	const handleSubmit = async (e) => {
		setLoadingState(true)
		let _form = { ...modalForm };
		let nowtime = new Date();
		let promises = [];

		if (_form.ImageFile) {
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
					let ext = _form.ImageFile.name.split(".").pop();

					_form.imageNm = `/files/artists/${nowtime.getTime()}.${ext}`;
					const storeRef = ref(storage, `files/artists/${nowtime.getTime()}.${ext}`);
					const uploadTask = uploadBytesResumable(storeRef, _form.ImageFile);
					uploadTask.on("state_changed",
						(snapshot) => {
							const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
							setPercent(parseInt(progress));
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
							console.error(error, "Upload was failed.");

							reject();
						},
						() => {
							getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
								_form.ImageURL = downloadURL;
								console.log("Upload was succeeded!", downloadURL);
								setPercent(0);
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
				_form.key = push(child(d_ref(_db), "artists")).key;

			update(d_ref(_db), {
				[`/artists/${_form.key}`]: {
					name: _form.name,
					description: _form.description,
					ImageURL: _form.ImageURL,
					imageNm: _form.imageNm,
				}
			});
			setIsModalOpen(false);
			setModalForm(formInit);
			setLoadingState(false)

		}
		catch (e) {
			setIsModalOpen(false)
			setModalForm(formInit);
			setLoadingState(false)
		}


	}
	useEffect(() => {

		const collection = d_ref(_db, 'artists/');
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
		_form["ImageFile"] = e.target.files[0];
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
								Table of Artists
							</VuiTypography>
							<VuiButton variant="gradient" color="primary" onClick={onAddClick}><Icon>edit</Icon>Add</VuiButton>
						</VuiBox>
						<Modal style={{ background: "none" }} open={isModalOpen} closable={false} footer={null} >



							<div className="bg-c-dark round-lg p-5">
								<h3 className="text-light">
									Artist Form
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
												<VuiInput type="text" name="name" value={modalForm.name} onChange={InputChange} placeholder="Name of Beat file..." fontWeight="500" />
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
												<VuiInput type="text" name="description" value={modalForm.description} onChange={InputChange} placeholder="Description of Beat file..." fontWeight="500" />
											</GradientBorder>
										</VuiBox>

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
