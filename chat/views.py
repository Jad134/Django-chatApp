from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from .models import Message, Chat
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
import json

# Create your views here.
@login_required(login_url='/login/')
def index(request):
    if request.method =='POST':
      print("Received data" + request.POST['textmessage'])
      myChat = Chat.objects.get(id=2)
      new_message =  Message.objects.create(text = request.POST['textmessage'], chat=myChat, author=request.user, receiver=request.user)
      serialized_obj = serializers.serialize('json', [new_message,])
      message_data = json.loads(serialized_obj)[0]
       # Modify the author field to include the username
      message_data['fields']['author'] = request.user.username  
      message_data['fields']['created_at'] = new_message.created_at.strftime('%B %d, %Y')
      return JsonResponse(message_data, safe=False)
    chatMessages = Message.objects.filter(chat__id=2)
    return render(request, 'chat/index.html', {'messages':chatMessages})

def login_view(request):
    if request.method =='POST':
      user = authenticate(username= request.POST.get('username'), password=request.POST.get('password'))
      if user:
        login(request, user)
        return HttpResponseRedirect('/chat/') 
      else:
          return render(request, 'auth/login.html',{'wrongPassword': True})
    return render(request, 'auth/login.html')

def register_view(request):
  if request.method =='POST':
    confirmPassword = request.POST.get('controllPassword')
    password = request.POST.get('createPassword')
    if password == confirmPassword:
     user = User.objects.create_user( username= request.POST.get('createUsername'),
     email= request.POST.get('createMail'),
     password= password)
    else:
     return render(request, 'register/register.html', {'notSimilarPassword': True})
  return render(request, 'register/register.html')

def logout_view(request):
 logout(request)
 return HttpResponseRedirect('/login') 