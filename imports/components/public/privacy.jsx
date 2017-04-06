import React, { Component } from "react";

export default class PrivacyPolicyScreen extends Component {

  text() {
    return [
      {
        title: "What This Privacy Policy Applies To",
        text: "This privacy policy applies to all software produced by Brachyon Inc., which include, but are not limited to, the brachyon.com website, all subdomains using brachyon.com as the root domain name, all subpages located within the primary domain and subdomains, the Brachyon mobile application, and the Brachyon desktop application.\nThis policy does not apply to any third party that may be using external Brachyon services, such as a mobile application that integrates with a Brachyon API. Brachyon has no control over such parties. Brachyon urges strong discretion and care in supplying private information online.\nBy using the services and technologies provided by Brachyon Inc, you accept the practices as defined in the Brachyon Privacy Policy. If you do not agree with the practices, delete all cookies from the browser caches of all browsers used to access Brachyon and halt usage of Brachyon immediately. Continued usage of Brachyon products and technologies signifies an acceptance of the practices as defined in this privacy policy."
      },
      {
        title: "Information Collection and Usage",
        text: "Brachyon may collect personally identifiable information, such as your real name, email, or IP address. Brachyon may use some of this information to infer other details, such as name or location.\nBrachyon may track some of your information through the usage of “cookies”. Cookies are a means of storing information regarding your transactions with the Brachyon website through the web browser. This information may include any information that you provide to Brachyon services, including your IP address, location, etc.\nBrachyon may also utilize third party services in order to access information collected from other parties, and to track your usage of Brachyon services. Payment services utilize Stripe, and their privacy policy can be found at https://stripe.com/us/privacy/.\nOur website and services are directed to the general public. We do not knowingly collect information from children under 13 years of age or have any reasonable grounds for believing that children under the age of 13 are accessing our website or using our services. If we learn that we have inadvertently collected personal information from a child under age 13, we will delete that information as quickly as possible."
      },
      {
        title: "Sharing and Disclosure of Information",
        text: "Brachyon reserves all rights to utilize your personal information for all purposes. "
      },
      {
        title: "Choice and Data Retention",
        text: "Brachyon requires your personal information to confirm your identity on the Brachyon website and associated services. Your personal information can be updated through interfaces located on the Brachyon website.\nBrachyon may occasionally send you communications regarding information you may be interested in. You have the option to opt out of such communications by request. These requests can be made by contacting Brachyon staff directly. The contact information for Brachyon staff can be found here."
      },
      {
        title: "Protection of Information",
        text: "Brachyon will take reasonable effort in order to protect your provided personal information. Your personal information will be accessible and editable only by administrative staff on the Brachyon team and yourself. At the time of account creation, you must provide a secret key, known as a password, in order to authenticate yourself with our services, such that you can access your personal information. Information sent from your system to Brachyon services will be secured through SSL, a form of encryption that provides a translation of your information to a format that can only be read by authorized users. Physical access to data storage regarding your personal information is handled by secure third party services."
      },
      {
        title: "Changes and Notifications",
        text: "Brachyon reserves the right to make changes to this privacy policy at the discretion of Brachyon Inc. Review this policy regularly to check for updates. For retroactive changes, you may receive notifications regarding the changes."
      }
    ]
  }

  render() {
    return (
      <div className="row center">
        <div className="col side-tab-panel">
          <h2 style={{margin: "0 0 20px 0"}}>Privacy Policy</h2>
          {
            this.text().map(val => {
              return (
                [
                  (<h4>{ val.title }</h4>)
                ].concat(
                  val.text.split("\n").map(t => {
                    return (<div className="about-what">{ t }</div>)
                  })
                )
              )
            })
          }
        </div>
      </div>
    )
  }
}
