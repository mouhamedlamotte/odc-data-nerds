"use client";

import {
  Loader,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getPromos, getStudents } from "@/db/fetchdata";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { addDocument, uploadImage } from "@/db/addData";
import { useToast } from "./ui/use-toast";
import { deleteDocument } from "@/db/deletedata";

export function Students() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);


  const { toast } = useToast();

  const router = useRouter();

  const fetPromos = async () => {
    const pm = await getPromos();
    if (pm) {
      setPromos(pm);
    }
  };

  const fetStudents = async () => {
    const sm = await getStudents();
    if (sm) {
      setStudents(sm);
    }
  };

  useEffect(() => {
    fetPromos();
    fetStudents();
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      deleteCookie("token");
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  const onAdd = (student) => {
    setStudents([...students, student]);
  };


  const handleDelete = async (id) => {
    await deleteDocument("Students", id).then(() => {
      const newStudents = students.filter((student) => student.id !== id);
      setStudents(newStudents);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      })
    }).catch((error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    });
  }


  const searchStudents = (searchTerm) => {
    setFilteredStudents(students);
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const new_students = students.filter(student =>
      student.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
      student.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
      student.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      student.phone.includes(lowerCaseSearchTerm) ||
      student.promo_id.includes(lowerCaseSearchTerm)
    );

    setFilteredStudents(new_students);
    
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <h3 className="text-3xl font-bold hidden md:flex">Les Data Nerds 🤓🫡</h3>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                onChange={(e) => {
                  if (e.target.value === "") {
                    fetStudents();
                  } else {
                    searchStudents(e.target.value);
                  }
                }}
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                    <AvatarFallback>
                      {user?.displayName
                        ? user?.displayName[0]
                        : user?.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.displayName ? user?.displayName : user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          {loading ? (
            <div className="flex h-[50vh] w-full items-center justify-center">
              <Loader className="h-10 w-10 animate-spin" />
            </div>
          ) : null}
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="P6" className="w-full">
              <div className="flex items-center">
                <TabsList>
                  {promos.map((promo) => (
                    <TabsTrigger key={promo.id} value={promo.Code}>
                      {promo.Name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {!loading ? <AddStudent onAdd={onAdd} promos={promos} /> : null}
              </div>
              {promos.map((promo) => (
                <TabsContent value={promo.Code} key={promo.id}>
                  <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                      <CardTitle>{promo.Name}</CardTitle>
                      <CardDescription>
                        les etudiants de la promotion{" "}
                        {promo?.Name?.toLowerCase()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                              <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Prenom</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Numero
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Promo Id
                            </TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students
                            .filter((student) => student.promo_id === promo.id)
                            .map((student) => (
                              <TableRow className="transition-all duration-300 ease-in cursor-pointer hover:bg-muted" key={student.id}>
                                <TableCell className="hidden sm:table-cell">
                                  <Avatar className="h-20 w-20 rounded-sm">
                                    <AvatarFallback className="h-20 w-20 rounded-sm">
                                      {student.firstName[0]?.toUpperCase()}
                                      {student.lastName[0]?.toUpperCase()}
                                    </AvatarFallback>
                                    <AvatarImage src={student.avatar} />
                                  </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {student.firstName ? (
                                    student.firstName
                                  ) : (
                                    <Badge>non renseigné</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {student.lastName ? (
                                    student.lastName
                                  ) : (
                                    <Badge>non renseigné</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {student.email ? (
                                    student.email
                                  ) : (
                                    <Badge>non renseigné</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {student.phone ? (
                                    student.phone
                                  ) : (
                                    <Badge>non renseigné</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {student.promo_id}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Toggle menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDelete(student.id)}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <div className="text-xs text-muted-foreground">
                        {promo.student_count} etudiants
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

const AddStudent = ({ promos, onAdd }) => {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    promo_id: "",
  });

  const handlePromoChange = (promoId) => {
    setStudent({ ...student, promo_id: promoId });
  };

  const handlechange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setLoading(true);
    if (student.email && student.promo_id) {
      if (file) {
        uploadImage(file, `students/avatars/${file.name}`).then(
          (url) => {
            addDocument("Students", { ...student, avatar: url }).then(() => {
              setStudent({
                avatar: "",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                promo_id: "",
              });
              setFile(null);
              onAdd({ ...student, avatar: url });
      setLoading(false);
      toast({
        title: "Etudiant ajoute",
        description: "L'étudiant a bien été ajoute",
      })
            });
          }
        );
      } else {
        addDocument("Students", student).then(() => {
          setStudent({
            avatar: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            promo_id: "",
          });
          onAdd(student);

      setLoading(false);
      toast({
        title: "Etudiant ajoute",
        description: "L'étudiant a bien été ajoute",
      })
        });
      }
      
    } else {
      
      setLoading(false);
      toast({
        title: "Etudiant non ajoute",
        description: "Veuillez renseigner tous les champs",
        variant: "destructive",
      })
      setFile(null);
    }
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Ajouter un étudiant
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Nouvel étudiant</SheetTitle>
            <SheetDescription>Ajouter un nouvel étudiant</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="name" className="text-start">
                Promotion
              </Label>
              <Select
                onValueChange={(value) => {
                  handlePromoChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner une promo" />
                </SelectTrigger>
                <SelectContent>
                  {promos.map((promo) => (
                    <SelectItem key={promo.id} value={promo.id}>
                      {promo.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="avatar" className="w-full flex justify-center">
                <Avatar className="h-40 w-40 ">
                  <AvatarImage src={file ? URL.createObjectURL(file) : ""} />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                id="avatar"
                className="col-span-3 hidden"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="firstName" className="text-strat">
                Prenom
              </Label>

              <Input
                onChange={handlechange}
                id="firstName"
                name="firstName"
                value={student.firstName}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="lastName" className="text-strat">
                Nom
              </Label>

              <Input
                onChange={handlechange}
                id="lastName"
                name="lastName"
                value={student.lastName}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="email" className="text-strat">
                Email
              </Label>

              <Input
                onChange={handlechange}
                id="email"
                name="email"
                type="email"
                value={student.email}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="phone" className="text-strat">
                Numero de telephone
              </Label>

              <Input
                id="phone"
                name="phone"
                onChange={handlechange}
                value={student.phone}
                className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-2 gap-2">
              <SheetClose asChild>
                <Button variant="destructive">Annuler</Button>
              </SheetClose>
              {
                loading ?               <Button >
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              </Button> :
              <Button onClick={handleAdd}>
              Enregistrer
            </Button>
              }


            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
