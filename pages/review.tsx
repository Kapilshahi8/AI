import Head from "next/head";
import { useState, useEffect } from "react";
import React from "react";
import { socialIcon, themeUserDetails } from "./helper/theme";

export default function Review() {
	// Create a ref for the div element
	const [brandName, setBrandName] = useState(themeUserDetails.brandName);
	const [brandURL, setBrandURL] = useState(themeUserDetails.brandURL);

	const [selectedImage, setSelectedImage] = useState(null);
	
	const [emailBody, setEmailBody] = useState(() => "");
	const [imageUrl, setImageUrl] = useState(null);
	const [emailSubjectLine, setEmailSubjectLine] = useState(() => "");
	const [isLoading, setIsLoading] = useState(false);
	const [ispreview, setIspreview] = useState(false);
	const [feedback, setFeedback] = useState('');
	useEffect(() => {
		if (selectedImage) {
			console.log(selectedImage);
			setImageUrl(URL.createObjectURL(selectedImage));
			setIspreview(true);
			console.log(imageUrl);
			uploadToServer();
		}
	}, [selectedImage]);

	
	useEffect(() => {
	}, []); 


	async function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);
		let body = { brandname: brandName, brandURL: brandURL, brandLogo:imageUrl }
		if(feedback !== ''){
			body['feedback'] = feedback;
		}
		const response = await fetch("/api/review", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		const data = await response.json();
		let rawResult = data.result;
		if(rawResult.length > 0){
			setEmailSubjectLine(rawResult[0])
			setEmailBody(rawResult[1])
		} else {
			rawResult.split('\n');
			setEmailSubjectLine(rawResult[0])
			setEmailBody(rawResult[1])
		}
		setIsLoading(false);
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

	return (
		<div>

			<Head>
				<title>Marketing Mail</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col 
                    items-center justify-center m-20">
				<h3 className="text-slate-900 text-xl mb-3">
					Goal of task {themeUserDetails.username}!
				</h3>
				<form onSubmit={onSubmit}>
					<label>Brand name</label>
					<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="brandName" placeholder="Enter a product name" value={brandName} onChange={(event) => { themeUserDetails[event.target.attributes[2].nodeValue] = event.target.value; setBrandName(event.target.value) }}
					/>

					<label>Brand URL</label>
					<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="brandURL"
						placeholder="Enter a product name" value={brandURL} onChange={(event) => { themeUserDetails[event.target.attributes[2].nodeValue] = event.target.value; setBrandURL(event.target.value) }}
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
							<div>Image Preview: <span onClick={()=>setIspreview(!ispreview)}>Click to preview </span> </div>
						</div>
					)}
					{ispreview && (
						<img className="img-fluid" src={imageUrl} alt={selectedImage.name} />
					)}

					<button className="text-lg w-full bg-fuchsia-600 h-10 mt-3 text-white
                              rounded-2xl mb-10" type="submit">
						Promote Menu Item
					</button>
				</form>
				{isLoading ? (
					<p>Loading... be patient.. may take 30s+</p>
				) : emailSubjectLine ? (
					<div className="relative w-2/4 ">
						<div className="rightleftpadd">
							<button className="btn btn-primary">Accept</button>
							<button className="btn btn-danger pull-right" onClick={(e)=> { setFeedback(window.prompt('Please provide the feedback')); onSubmit(e) }  }>Reject</button>
						</div>
						<div
							dangerouslySetInnerHTML={{ __html: themeUserDetails.emailTemplate.replace('--logo--', imageUrl).replace('--brandingImg--', themeUserDetails.brandImageSRC).replace('Subject_Line', emailSubjectLine.replaceAll('Subject:', '')).replace('Email_Body', emailBody.replaceAll('Email Body:', '')).replaceAll('email_body:', '') }}>
						</div>
						{/* {result.replaceAll('\n', '<br>')} */}
					</div>

				) : null}


			</main>
			<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
			<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		</div>

	);
}