<h1>VisitVaslui CMS - REST API</h1>
<h2>Description</h2>
This REST API serves as the backend CMS <strong>(Content Management System)</strong> for the VisitVaslui tourism platform, enabling administrators to manage the sights and events featured on the website. The API allows CRUD operations on tourism-related data, with admin authentication required for all administrative actions.
<h2>API Enhancements</h2>
<ul>
<li>Better auth using JWT over http only cookie</li>
<li>This update introduces a higher-order function (asyncHandler) to wrap all async routes, ensuring centralized error handling.</li>
<li>Implemented a "Thin Controller And Fat Model" concept</li>
<li>Enhances API security with input sanitization to prevent NoSQL query injection attacks, rate limiter to mitigate DDoS by capping requests per IP, and secure HTTP headers.</li>
</ul>
