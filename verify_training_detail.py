from playwright.sync_api import sync_playwright

def verify_training_detail():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to capture the full layout
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Mock APIs
        # Mock Training Details
        page.route("**/Video/VideoTrain/ShowTrainDetil", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''{
                "code": 200,
                "data": {
                    "id": "1",
                    "train_id": "1",
                    "name_label": "Advanced Tailwind CSS Training",
                    "description": "Master utility-first CSS framework for rapid UI development. This comprehensive course covers everything from basics to advanced configuration and customization.",
                    "person_num": 120,
                    "start_date": "2023-10-01 09:00:00",
                    "end_date": "2023-12-31 18:00:00",
                    "create_dept": "Technology Department",
                    "detail": [
                        {
                            "id": "1",
                            "name_label": "Chapter 1: Fundamentals",
                            "type": "0",
                            "is_must": 1,
                            "is_finish": true,
                            "detail": [
                                {
                                    "video": {
                                        "title": "Introduction to Utility Classes",
                                        "duration": "10:30",
                                        "description": "Learn the core philosophy of Tailwind.",
                                        "thumbnail_path": "path/to/thumb1.jpg"
                                    },
                                    "course_id": "101",
                                    "type": "video"
                                },
                                {
                                    "video": {
                                        "title": "Responsive Design",
                                        "duration": "15:45",
                                        "description": "Building mobile-first layouts.",
                                        "thumbnail_path": "path/to/thumb2.jpg"
                                    },
                                    "course_id": "102",
                                    "type": "video"
                                }
                            ]
                        },
                         {
                            "id": "2",
                            "name_label": "Chapter 2: Assessment",
                            "type": "1",
                            "is_must": 0,
                            "is_finish": false,
                            "detail": [
                                {
                                    "exam": {
                                        "id": "201",
                                        "name_label": "Mid-term Exam",
                                        "start_time": "2023-11-15 09:00",
                                        "end_time": "2023-11-20 18:00",
                                        "max_reply_num": 3
                                    },
                                    "type": "exam"
                                }
                            ]
                        }
                    ]
                }
            }'''
        ))

        # Mock Learning Status (Stats)
        page.route("**/Video/VideoAnalyze/getClassUserTrainLearingInfo", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''{
                "code": 200,
                "data": {
                    "total": 1,
                    "list": [{
                        "course_num": 10,
                        "finsh_course_num": 7,
                        "no_finsh_course_List": [{}, {}, {}],
                        "exam_num": 2,
                        "finsh_exam_num": 1,
                        "no_finsh_exam_List": [{}],
                        "no_finsh_course_exam_List": []
                    }]
                }
            }'''
        ))

        # Mock Exam Records
        page.route("**/Video/VideoExam/getAnswerList", lambda route: route.fulfill(
             status=200,
             content_type="application/json",
             body='''{
                "code": 200,
                "data": {
                    "list": [
                        {"create_time": "2023-10-15 10:00", "create_user": "John Doe", "score": 85, "id": "1"},
                        {"create_time": "2023-10-16 11:30", "create_user": "John Doe", "score": 92, "id": "2"}
                    ]
                }
             }'''
        ))

        # Navigate
        page.goto("http://localhost:5173/#/sysbasics/video/userViews/TrainingDetail?id=1&class_id=1")

        # Wait for content to load
        page.wait_for_timeout(3000)

        # Take screenshot regardless of refresh button
        page.screenshot(path="verification_main.png")
        print("Main page screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_training_detail()
