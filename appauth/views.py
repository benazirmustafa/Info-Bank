from .models import *
from rest_framework import viewsets, permissions, generics, mixins
from rest_framework.response import Response
from rest_framework import status
from knox.models import AuthToken
from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from .createusers import excel2jsonClass

# from rest_framework.parsers import MultiPartParser


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            })
        else:
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class PasswordAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    model = User

    def post(self, request):
        user = request.user
        if not user.check_password(request.data.get('password')):
            return Response({'message': "Incorrect Password"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': "Success"}, status=status.HTTP_200_OK)


class ChangePasswordAPI(generics.UpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = PasswordSerializer
    model = User

    def update(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'message': "Incorrect Old Password"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({'message': "Password Updated Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManageUserAPI(generics.GenericAPIView,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.CreateModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin):

    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('-id')
    filter_backends = [DjangoFilterBackend]

    lookup_field = "id"

    def get(self, request, id=None):
        if id:
            return self.retrieve(request, id)
        else:
            return self.list(request)

    def post(self, request):
        return self.create(request)

    def put(self, request, id=None):
        return self.partial_update(request, id)

    def delete(self, request, id=None):
        return self.destroy(request, id)


# @method_decorator(login_required(login_url='/'), name='dispatch')
# class ManageUser(View):
#     def get(self, request):
#         users = User.objects.all()
#         folders = Folder.objects.all()
#         categories = Category.objects.all()
#         context = {
#             'users': users,
#             'categories': categories,
#             'folders': folders
#         }
#         return render(request, 'infobank/manage_users.html', context)

#     def post(self, request):
#         email = request.POST['email']
#         first_name = request.POST['first_name']
#         last_name = request.POST['last_name']
#         employee_id = request.POST['employee_id']
#         password = "ulka#{0}".format(employee_id)
#         folder_set = request.POST.getlist('folder_set', None)
#         category_set = request.POST.getlist('category_set', None)
#         try:
#             user = User.objects.create(
#                 email=email,
#                 first_name=first_name,
#                 last_name=last_name,
#                 employee_id=employee_id,
#                 is_active=True
#             )
#             user.set_password(password)
#             user.save()

#             if folder_set:
#                 for each_val in folder_set:
#                     user.folder_set.add(each_val)
#             if category_set:
#                 for each_val in category_set:
#                     user.category_set.add(each_val)
#             return JsonResponse({"status": "ok"})
#         except IntegrityError:
#             return JsonResponse({
#                 "status": "failed",
#                 "message": "User Already Exists"
#             })

#     def delete(self, request, id):
#         user = User.objects.get(id=id).delete()
#         return JsonResponse({
#             "status": "ok"
#         })

#     def dispatch(self, request, *args, **kwargs):
#         if not request.user.is_superuser:
#             raise PermissionDenied
#         return super(ManageUser, self).dispatch(request, *args, **kwargs)
class SearchAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        get_user = User.objects.filter(Q(email__contains=request.GET.get('search')) | Q(
            first_name__icontains=request.GET.get('search')) | Q(last_name__icontains=request.GET.get('search')))
        get_result = UserShortSerializer(get_user, many=True).data
        return Response(get_result)


class GroupsAPI(generics.GenericAPIView,
                mixins.ListModelMixin,
                mixins.RetrieveModelMixin,
                mixins.CreateModelMixin,
                mixins.UpdateModelMixin,
                mixins.DestroyModelMixin):

    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    filter_backends = [DjangoFilterBackend]

    lookup_field = "id"

    def get(self, request, id=None):
        if id:
            return self.retrieve(request, id)
        else:
            return self.list(request)

    def post(self, request):
        return self.create(request)

    def put(self, request, id=None):
        return self.partial_update(request, id)

    def delete(self, request, id=None):
        return self.destroy(request, id)


class DesignationAPI(generics.GenericAPIView,
                     mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.CreateModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin):

    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = DesignationSerializer
    queryset = Designation.objects.all()
    filter_backends = [DjangoFilterBackend]

    lookup_field = "id"

    def get(self, request, id=None):
        if id:
            return self.retrieve(request, id)
        else:
            return self.list(request)

    def post(self, request):
        return self.create(request)

    def put(self, request, id=None):
        return self.partial_update(request, id)

    def delete(self, request, id=None):
        return self.destroy(request, id)

# class CreateUserAllAPI(APIView):
#     parser_classes = [MultiPartParser]
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]

#     def post(self, request):
#         file_obj = request.data["filename"]
#         wb = load_workbook(file_obj, data_only=True)
#         data = []
#         for sheet in wb.worksheets:
#             rows = sheet.iter_rows(max_col=sheet.max_column, values_only=True)
#             row_0 = []
#             ip_received_date_col = None
#             qa_outlook_col = None
#             ip_library_name_index = None
#             plm_lib_id_index = None
#             for (index, row) in enumerate(rows):
#                 if index == 0:
#                     for (col_index, col) in enumerate(row):
#                         if col.lower() == "ip library name":
#                             ip_library_name_index = col_index
#                         if col.lower() == "plm lib id":
#                             plm_lib_id_index = col_index

#                         if col == "Installation Owner":
#                             col_name = "create_user"
#                         elif col.lower() == "plm lib id":
#                             col_name = "plm_details"
#                         else:
#                             col_name = col.lower().replace(
#                                 " ", "_").replace("-", "_")
#                         if col_name == "ip_received_date":
#                             ip_received_date_col = col_index
#                         elif col_name == "qa_outlook":
#                             qa_outlook_col = col_index

#                         row_0.append(col_name)
#                 else:
#                     row_list = list(row)
#                     empty = False
#                     if ip_library_name_index and plm_lib_id_index:
#                         if row_list[ip_library_name_index] == None and row_list[plm_lib_id_index] == None:
#                             empty = True
#                     if not empty:
#                         if ip_received_date_col != None:
#                             ip_received_date = convert_to_date(
#                                 row_list[ip_received_date_col])
#                             row_list[ip_received_date_col] = ip_received_date

#                         if qa_outlook_col != None:
#                             qa_outlook = convert_to_date(
#                                 row_list[qa_outlook_col])
#                             row_list[qa_outlook_col] = qa_outlook
#                         data.append(dict(zip(row_0, row_list)))
#         serializer = ExcelDesignKitSerializer(data=data, many=True)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(status=status.HTTP_200_OK)
#         else:
#             return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
# from createusers import


class CreateUserAllAPI(APIView):
    def post(self, request):
        # request_data  =
        excel2jsonCls = excel2jsonClass(
            request.data, "all")
        # Starting the excel2json2model_tb_gen_class
        json_data = excel2jsonCls.run()
        for user_data in json_data:
            if User.objects.filter(employee_id=int(user_data['employee_id'])).exists():
                user = User.objects.get(
                    employee_id=int(user_data['employee_id']))
                user.email = user_data['email']
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']

                if Group.objects.filter(name=user_data['group']).exists():
                    user_group = Group.objects.get(name=user_data['group'])
                    group = user_group.id
                    if Designation.objects.filter(title=user_data['dsg']).exists():
                        designation = Designation.objects.get(
                            title=user_data['dsg'])
                        user.designation = designation
                    else:
                        return Response({'message': "Designation name "+user_data['dsg']+" not found"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': "Department name "+user_data['group']+" not found"}, status=status.HTTP_400_BAD_REQUEST)

                user.groups.add(group)

            else:
                if User.objects.filter(email=user_data['email']).exists():
                    return Response({'message': "Email "+user_data['email']+" already exists"}, status=status.HTTP_400_BAD_REQUEST)
                email = user_data['email']
                employee_id = int(user_data['employee_id'])
                user = User.objects.create(
                    employee_id=employee_id, email=email)
                # password = User.objects.make_random_password(length=8)
                # password = 'ulkasemi#' + str(user_data['employee_id'])
                password = "123456bm"
                user.set_password(password)
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']

                if Group.objects.filter(name=user_data['group']).exists():
                    user_group = Group.objects.get(name=user_data['group'])
                    group = user_group.id
                    user.groups.add(group)

                    if Designation.objects.filter(title=user_data['dsg']).exists():
                        designation = Designation.objects.get(
                            title=user_data['dsg'])
                        user.designation = designation
                    else:
                        return Response({'message': "Designation name "+user_data['dsg']+" not found"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': "Department name "+user_data['group']+" not found"}, status=status.HTTP_400_BAD_REQUEST)
            if user_data['reports_to']:
                if User.objects.filter(employee_id=int(user_data['reports_to'])).exists():
                    userr = User.objects.get(
                        employee_id=int(user_data['reports_to']))
                    user.reports_to = userr
                else:
                    employee_id = int(user_data['reports_to'])
                    user_new = User.objects.create(employee_id=employee_id)
                    # password = User.objects.make_random_password(length=8)
                    # password = 'ulkasemi#' + str(user_data['reports_to'])
                    password = "123456bm"
                    user_new.set_password(password)
                    user_new.save()
                    user.reports_to = user_new

            user.save()
        return Response({'message': "Users Successfully Created"}, status=status.HTTP_200_OK)
