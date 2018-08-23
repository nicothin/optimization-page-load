from locust import HttpLocust, TaskSet

# def login(l):
#     l.client.post("login", {"username":"ellen_key", "password":"education"})

def index(l):
    l.client.get("index.html")

def product(l):
    l.client.get("product.html")

def store(l):
    l.client.get("store.html")

class UserBehavior(TaskSet):
    tasks = {index: 6, product: 4, store: 4}

    # def on_start(self):
    #     login(self)

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000
