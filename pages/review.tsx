import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import React from "react";
import { socialIcon, themeUserDetails } from "./helper/theme";
import fb from '../public/img/facebook2x.png'
import Image from "next/image";
export default function Review() {
	// Create a ref for the div element
	const textDivRef = useRef<HTMLDivElement>(null);
	const [brandName, setBrandName] = useState(themeUserDetails.brandName);
	const [brandURL, setBrandURL] = useState(themeUserDetails.brandURL);
	const [productInput, setProductInput] = useState("");
	const [emailBody, setEmailBody] = useState(() => "");
	const [emailSubjectLine, setEmailSubjectLine] = useState(() => "");
	const [isLoading, setIsLoading] = useState(false);


	// Add a click event listener to the copy icon that copies the text in the div to the clipboard when clicked
	useEffect(() => {
		const copyIcon = document.querySelector(".copy-icon");
		if (!copyIcon) return;
		copyIcon.addEventListener("click", () => {

			let text;
			if (textDivRef.current) {
				text = textDivRef.current.textContent;
			}

			// Create a hidden textarea element
			const textArea = document.createElement("textarea");
			textArea.value = text;
			document.body.appendChild(textArea);

			// Select the text in the textarea
			textArea.select();

			// Copy the text to the clipboard
			document.execCommand("copy");

			// Remove the textarea element
			document.body.removeChild(textArea);
		});
	}, []); // Run this only once


	async function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);
		const response = await fetch("/api/review", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ask: productInput }),
		});
		const data = await response.json();

		let rawResult = data.result;

		console.log(rawResult);

		setEmailSubjectLine(rawResult[0])
		setEmailBody(rawResult[1])
		// setResult(rawResult);

		// setProductInput("");
		setIsLoading(false);
	}

	return (
		<div>

			<Head>
				<title>Marketing Mail</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* <div className="container register">
                <div className="row">
                    <div className="col-md-3 register-left">
                        <img src="image.png" alt=""/>
                        <h3>Welcome {themeUserDetails.username}</h3>
                    </div>
                    <div className="col-md-9 register-right">
                        <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="home-tab" data-toggle="tab" role="tab" aria-controls="home" aria-selected="true">Send users to website</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="profile-tab" data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false">Promote a menu item</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <h3 className="register-heading">Goal of task</h3>
                                <div className="row register-form">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Brand Name</label>
                                            <input type="text" className="form-control" placeholder="First Name *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <label>Brand URL</label>
                                            <input type="text" className="form-control" placeholder="Last Name *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <label>Brand Logo</label>
                                            <input type="password" className="form-control" placeholder="Password *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <label></label>
                                            <input type="password" className="form-control"  placeholder="Confirm Password *" value="" />
                                        </div>
                                        <div className="col-sm-12 text-right">
                                        <input type="button" className="btn btn-primary"  value="Register"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade show" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <h3  className="register-heading">Apply as a Hirer</h3>
                                <div className="row register-form">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="First Name *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Last Name *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <input type="email" className="form-control" placeholder="Email *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <input type="text"  className="form-control" placeholder="Phone *" value="" />
                                        </div>


                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input type="password" className="form-control" placeholder="Password *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control" placeholder="Confirm Password *" value="" />
                                        </div>
                                        <div className="form-group">
                                            <select className="form-control">
                                                <option className="hidden"  selected disabled>Please select your Sequrity Question</option>
                                                <option>What is your Birthdate?</option>
                                                <option>What is Your old Phone Number</option>
                                                <option>What is your Pet Name?</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="`Answer *" value="" />
                                        </div>
                                        <input type="submit" className="btnRegister"  value="Register"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}

			<main className="flex flex-col 
                    items-center justify-center m-20">
				<h3 className="text-slate-900 text-xl mb-3">
				Goal of task {themeUserDetails.username}!
				</h3>
				<form onSubmit={onSubmit}>
					<label>Brand name</label>
					<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="brandName" readOnly={true} placeholder="Enter a product name" value={brandName} onChange={(e) =>
						setBrandName(e.target.value)}
					/>

					<label>Brand URL</label>
					<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="brandURL"
					readOnly={true}	placeholder="Enter a product name" value={brandURL} onChange={(e) => setBrandURL(e.target.value)}
					/>

					{/* <label>Is brand Have menu</label>
					<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="radio" value={themeUserDetails.isBrandHaveMenu ? "true" : "false"}/>Yes 
					<input className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="radio" value={themeUserDetails.isBrandHaveMenu ? "true" : "false"}/>No
					 */}
					{/* { themeUserDetails.isBrandHaveMenu ? (
						<>
							<label>Brand Menu</label>
							<input className="text-sm text-gray-base w-full  mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="product"
								placeholder="Enter a product name" value={productInput} onChange={(e) => setProductInput(e.target.value)}
							/>
						</>
						) : (
							<div>welcome</div>
						)
					}

					

					<label>Purpose To generate Email</label>
					<input className="text-sm text-gray-base w-full  mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="product"
						placeholder="Enter a product name" value={productInput} onChange={(e) => setProductInput(e.target.value)}
					/>

					<label>Purpose To generate Email</label>
					<input className="text-sm text-gray-base w-full  mr-3 py-5 px-4 h-2 border border-gray-200 rounded mb-2" type="text" name="product"
						placeholder="Enter a product name" value={productInput} onChange={(e) => setProductInput(e.target.value)}
					/> */}

					<button className="text-lg w-full bg-fuchsia-600 h-10 mt-3 text-white
                              rounded-2xl mb-10" type="submit">
						Promote Menu Item
					</button>
				</form>
				{isLoading ? (
				<p>Loading... be patient.. may take 30s+</p>
			) : emailSubjectLine ? (
				<div className="relative w-2/4 ">
					
					<div ref={textDivRef}
						dangerouslySetInnerHTML={{ __html: themeUserDetails.emailTemplate.replace('--logo--', themeUserDetails.logoURl).replace('--brandingImg--', themeUserDetails.brandImageSRC).replace('--social-facebook--', socialIcon.facebook).replace('--social-insta--',socialIcon.instagram).replace('--social-twitter--',socialIcon.twitter).replace('Subject_Line', emailSubjectLine.replaceAll('Subject:','')).replace('Email_Body', emailBody.replaceAll('Email Body:', '')).replaceAll('email_body:','') }}>
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