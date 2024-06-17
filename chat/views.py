from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from .models import Message, Chat
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
import json

# Create your views here.
@login_required(login_url='/login/')
def index(request):
    """
    This is a view to render the chat messages.
    Handles the rendering of the chat interface and processes
    incoming chat messages.
    """
    if request.method =='POST':
      print("Received data" + request.POST['textmessage'])
      myChat = Chat.objects.get(id=7)
      new_message =  Message.objects.create(text = request.POST['textmessage'], chat=myChat, author=request.user, receiver=request.user)
      serialized_obj = serializers.serialize('json', [new_message,])
      message_data = json.loads(serialized_obj)[0]
      message_data['fields']['author'] = request.user.username  
      message_data['fields']['created_at'] = new_message.created_at.strftime('%B %d, %Y')
      return JsonResponse(message_data, safe=False)
    chatMessages = Message.objects.filter(chat__id=7)
    return render(request, 'chat/index.html', {'messages':chatMessages, 'user': request.user,})

def login_view(request): 
    """
    This renders the view for the login Screen 
    and send request do django authenticate function
    """
    if request.method =='POST':
      user = authenticate(username= request.POST.get('username'), password=request.POST.get('password'))
      if user:
        login(request, user)
        return HttpResponseRedirect('/chat/') 
      else:
          return render(request, 'auth/login.html',{'wrongPassword': True})
    return render(request, 'auth/login.html')

def register_view(request):
  """
  Renders the register view and create a new user with django create_user function
  """
  if request.method =='POST':
    password = request.POST.get('createPassword') 
    try:
     user = User.objects.create_user( username= request.POST.get('createUsername'),
     email= request.POST.get('createMail'),
     password= password)
     return JsonResponse({'success': True, 'redirect_url': '/login/'})
    except IntegrityError as e:
            if 'UNIQUE constraint' in str(e):
                return JsonResponse({'success': False, 'error': 'username_exists'})
            return JsonResponse({'success': False, 'error': 'unknown_error'})
    except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
  return render(request, 'register/register.html')

def logout_view(request):
 logout(request)
 return HttpResponseRedirect('/login') 


def redirect_view(request):
    return redirect('/login')