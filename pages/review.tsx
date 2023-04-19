import Head from "next/head";
import Image from 'next/image'
import { useState, useEffect } from "react";
import React from "react";
import { themeUserDetails } from "./api/helper/theme";
import Modal from 'react-modal'
import logo from '../public/img/logo.png'

const MyImage = (props) => {
	return (
	  <Image
		src={logo}
		alt="Picture of the Webpage"
		style={ {width:'30%', margin: 'auto'} }
	/>
	)
}
export default function Review() {

	// form control
	const [brandName, setBrandName] = useState(themeUserDetails.brandName);
	const [brandURL, setBrandURL] = useState(themeUserDetails.brandURL);
	const [goalTask, setGoalTask] = useState('Promote menu item');
	const [brandMenuURL, setBrandMenuURL] = useState('');
	const [businessType, setBusinessType] = useState('');
	const [feedback, setFeedback] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [selectedButtonText, setSelectedButtonText] = useState('');
	const [requestType, setRequestType] = useState('');


	//image
	const [imageUrl, setImageUrl] = useState(themeUserDetails.brandlogoURl);
	const [selectedImage, setSelectedImage] = useState(null);

	//email control
	const [emailBody, setEmailBody] = useState(() => "");
	const [emailSubjectLine, setEmailSubjectLine] = useState(() => "");
	const customStyles = { overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', width:'50%', transform: 'translate(-50%, -50%)' } }
	// theme control
	const [isLoading, setIsLoading] = useState(false);
	const [ispreview, setIspreview] = useState(false);

	useEffect(() => {
		if (selectedImage) {
			console.log('imageUrl', selectedImage);
			setImageUrl(URL.createObjectURL(selectedImage));
			setIspreview(true);
			console.log(imageUrl);
			uploadToServer();
		}
	}, [selectedImage]);


	useEffect(() => {
		setImageUrl(themeUserDetails.brandlogoURl);
	}, []);


	async function onSubmit() {
		setIsLoading(true);
		let body:Object = {};
		let apiRequest = '/';
		switch (requestType) {
			case 'changeBoth':
				body = {feedback: feedback, requestType:requestType, oldAiResponse: localStorage.getItem('response')}
				apiRequest="/api/feedback"
				break;
			default:
				body = {business_name: brandName, business_website: brandURL, brandLogo: imageUrl, goal_Task: goalTask, businessType:businessType }
				apiRequest="/api/review"
				break;
		}

		const response = await fetch(apiRequest, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();
		localStorage.setItem('response', JSON.stringify(data));
		setEmailSubjectLine(data.result.message.subjectLine);
		setEmailBody(data.result.message.emailBody);
		setIsLoading(false);
		setIsOpen(false);
	}

	const uploadToServer = async () => {
		const body = new FormData();
		// console.log("file", image)
		body.append("file", selectedImage);
		await fetch("/api/upload", {
			method: "POST",
			body
		});
	};

	const selectedReason = async (event) => {
		setSelectedButtonText(event.target.innerHTML);
	}


	

	return (
		<div>

			<Head>
				<title>Marketing Mail</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col items-center justify-center m-20">
			<div className="d-flex">
				<form className="requestForm pl-5">
				<MyImage/>
					<h3 className="text-slate-900 text-center text-xl mb-3 mt-2 text-underline">
						Goal of task {themeUserDetails.username}!
					</h3>
						<label>Business name</label>
						<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="brandName" placeholder="Enter a product name" value={brandName} onChange={(event) => { setBrandName(event.target.value) }}
						/>

						<label>Business URL</label>
						<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="brandURL"
							placeholder="Enter a product name" value={brandURL} onChange={(event) => { setBrandURL(event.target.value) }}
						/>

						<label>Business Type</label>
						<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="businessType"
							placeholder="Enter a product name" value={businessType} onChange={(event) => { setBusinessType(event.target.value) }}
						/>

						<label>Business Menu URL</label>
						<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="brandURL"
							placeholder="Enter a product name" value={brandMenuURL} onChange={(event) => { setBrandMenuURL(event.target.value) }}
						/>

						<label>What Purpose</label>
						{/* <select
							onChange={(e) => {
							setGoalTask(e.target.value);
							}} className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" >
							<option selected={true} value={'1'}>Promote Menu Page</option>
							<option value={'2'} >Take user to webiste</option>
						</select> */}
						<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="purpose"
							placeholder="Enter a product name" value={goalTask} onChange={(event) => { setGoalTask(event.target.value) }}
						/>

						<label>Brand Logo Image</label>
						<div className="form-group uploadButton">
							<input
								accept="image/*"
								type="file"
								id="select-image"
								style={{ display: 'none' }}
								onChange={(event) => { setSelectedImage(event.target.files[0]) }}
							/>
							<label htmlFor="select-image">
								Upload Image
							</label>
						</div>
						{imageUrl && selectedImage && (
							<div>
								<div>Image Preview: <span onClick={() => setIspreview(!ispreview)}>Click to preview </span> </div>
							</div>
						)}
						{ispreview && (
							<img className="img-fluid" src={imageUrl} alt={selectedImage.name} />
						)}

						<button className="text-lg w-full bg-fuchsia-600 h-10 mt-3 text-white rounded-2xl mb-10" type="button" onClick={()=>onSubmit()}>
							Generate Email
						</button>
					</form>
					{isLoading ? (
						<p>Loading... be patient.. may take 30s+</p>
					) : emailSubjectLine ? (
						<div className="relative w-2/4 ">
							<div className="rightleftpadd">
								<button className="btn btn-primary">Accept</button>
								<button className="btn btn-danger" onClick={() => setIsOpen(true)}>Reject</button>
							</div>
							<div
								dangerouslySetInnerHTML={{ __html: themeUserDetails.emailTemplate1.replaceAll('--logo--', imageUrl).replaceAll('--brandingImg--', themeUserDetails.brandImageSRC).replaceAll('Subject_Line', emailSubjectLine).replaceAll('Email_Body', emailBody).replaceAll('--brandMenu--',brandMenuURL).replaceAll('--brand--', brandURL) }}>
							</div>
							{/* {result.replaceAll('\n', '<br>')} */}
						</div>

					) : null}
			</div>
				

				<Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles} >
					<h1 className="header-title"> How can i make it better ?</h1>
					{/* <div className="d-flex">
						<button className="btn btn-primary pull-right" onClick={(e) => {selectedReason(e); setRequestType('subject_line')}}>Request for Change Subject Line</button>
						<button className="btn btn-primary pull-right" onClick={(e) => {selectedReason(e); setRequestType('email_Body') } }>Request for change Email Body</button>
						<button className="btn btn-primary pull-right" onClick={(e) => { selectedReason(e); setRequestType('changeBoth') }}>Reason for change whole content</button>
					</div> */}
					{isOpen &&
						<div className="feedbackArea mt-1">
							<textarea className="formControlTextArea" rows={3} onChange={(e)=>setFeedback(e.target.value)}/>
							<button className="btn btn-success w-100 mt-2" onClick={(e) =>{ setRequestType('changeBoth'); onSubmit();  }}>Submit</button>
						</div>
					}
				</Modal>
			</main>
		</div>

	);
}