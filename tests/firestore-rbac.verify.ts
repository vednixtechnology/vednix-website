import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import * as fs from "node:fs";
import * as path from "node:path";

interface TestResult {
  category: string;
  name: string;
  expected: string;
  actual: string;
  status: "PASS" | "FAIL";
  error?: string;
}

const results: TestResult[] = [];

function record(
  category: string,
  name: string,
  expected: string,
  actual: string,
  status: "PASS" | "FAIL",
  error?: string,
) {
  results.push({ category, name, expected, actual, status, error });
  const icon = status === "PASS" ? "✓" : "✗";
  console.log(`  [${icon}] ${category} :: ${name} -> ${status} (${actual})`);
  if (error && status === "FAIL") {
    console.error(`      Detail: ${error}`);
  }
}

async function runHardenedTestSuite() {
  console.log("============================================================");
  console.log("VEDNIX CMS — HARDENED FIRESTORE RBAC REGRESSION SUITE");
  console.log("Deterministic, Isolated, and Order-Independent Test Run");
  console.log("============================================================\n");

  const rulesContent = fs.readFileSync(
    path.resolve(process.cwd(), "firestore.rules"),
    "utf8",
  );

  const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
    projectId: "demo-vednix-rbac",
    firestore: {
      rules: rulesContent,
      host: "127.0.0.1",
      port: 8080,
    },
  });

  // Seed baseline emulator documents with security rules bypassed
  // Using explicit deterministic IDs separated between read fixtures and mutation targets
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    // 1. Admin accounts
    await setDoc(doc(db, "admins", "test-superadmin-001"), {
      email: "founder@vednix.com",
      name: "Founder SuperAdmin",
      role: "super_admin",
    });

    await setDoc(doc(db, "admins", "test-editor-001"), {
      email: "editor@vednix.com",
      name: "Content Editor",
      role: "editor",
    });

    // Malformed role identities
    const malformedRoles = [
      {
        id: "test-missing-role-001",
        data: { email: "missing@vednix.com", name: "Missing Role" },
      },
      {
        id: "test-null-role-001",
        data: { email: "null@vednix.com", name: "Null Role", role: null },
      },
      {
        id: "test-empty-role-001",
        data: { email: "empty@vednix.com", name: "Empty Role", role: "" },
      },
      {
        id: "test-admin-role-001",
        data: { email: "admin@vednix.com", name: "Admin Word", role: "admin" },
      },
      {
        id: "test-superadmin-word-001",
        data: {
          email: "sa@vednix.com",
          name: "SuperAdmin Word",
          role: "superadmin",
        },
      },
      {
        id: "test-hyphen-role-001",
        data: {
          email: "hyphen@vednix.com",
          name: "Super-Admin Word",
          role: "super-admin",
        },
      },
      {
        id: "test-owner-role-001",
        data: { email: "owner@vednix.com", name: "Owner Word", role: "owner" },
      },
      {
        id: "test-administrator-role-001",
        data: {
          email: "admin2@vednix.com",
          name: "Administrator Word",
          role: "administrator",
        },
      },
      {
        id: "test-root-role-001",
        data: { email: "root@vednix.com", name: "Root Word", role: "root" },
      },
      {
        id: "test-unknown-role-001",
        data: {
          email: "unknown@vednix.com",
          name: "Unknown Word",
          role: "custom_unknown",
        },
      },
    ];

    for (const m of malformedRoles) {
      await setDoc(doc(db, "admins", m.id), m.data);
    }

    // 2. Read-only content fixtures (never modified/deleted by tests)
    await setDoc(doc(db, "blogs", "blog-fixture-published"), {
      title: "Public Published Blog",
      status: "published",
      slug: "public-blog",
    });
    await setDoc(doc(db, "blogs", "blog-fixture-draft"), {
      title: "Draft Blog",
      status: "draft",
      slug: "draft-blog",
    });

    await setDoc(doc(db, "categories", "cat-fixture-tech"), {
      name: "Technology",
      slug: "technology",
    });

    await setDoc(doc(db, "productUpdates", "update-fixture-published"), {
      title: "Public Update",
      status: "published",
    });
    await setDoc(doc(db, "productUpdates", "update-fixture-draft"), {
      title: "Draft Update",
      status: "draft",
    });

    await setDoc(doc(db, "pressReleases", "press-fixture-published"), {
      title: "Public Press Release",
      status: "published",
    });
    await setDoc(doc(db, "pressReleases", "press-fixture-draft"), {
      title: "Draft Press Release",
      status: "draft",
    });

    await setDoc(doc(db, "careers", "career-fixture-open"), {
      title: "Frontend Engineer",
      status: "open",
    });
    await setDoc(doc(db, "careers", "career-fixture-closed"), {
      title: "Archived Role",
      status: "closed",
    });

    await setDoc(doc(db, "websiteSettings", "general"), {
      siteName: "Vednix Technology",
    });

    await setDoc(doc(db, "media", "media-fixture-001"), {
      publicId: "vednix/blogs/sample",
      url: "https://res.cloudinary.com/sample.jpg",
    });

    await setDoc(doc(db, "activityLogs", "log-fixture-001"), {
      action: "blog.created",
      summary: "Created blog post",
      actorEmail: "founder@vednix.com",
    });

    await setDoc(doc(db, "contact_messages", "contact-fixture-001"), {
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "+919876543210",
      subject: "Inquiry",
      message: "Hello Vednix team",
      consent: true,
    });

    await setDoc(doc(db, "early_access_users", "early-fixture-001"), {
      fullName: "John Smith",
      email: "john@example.com",
      phone: "+919876543211",
      occupation: "Developer",
      city: "Bengaluru",
      consent: true,
    });

    await setDoc(doc(db, "newsletter_subscribers", "sub-fixture-001"), {
      email: "sub@example.com",
      source: "footer",
    });

    await setDoc(doc(db, "career_applications", "app-fixture-001"), {
      fullName: "Candidate One",
      email: "candidate@example.com",
      phone: "+919876543212",
      position: "Full Stack Engineer",
      resumeLink: "https://drive.google.com/resume.pdf",
      status: "new",
      consent: true,
    });

    // 3. Isolated mutation targets (specifically designated for delete / update tests)
    await setDoc(doc(db, "blogs", "blog-target-delete-editor"), {
      title: "Blog for Editor Delete",
      status: "draft",
    });
    await setDoc(doc(db, "blogs", "blog-target-delete-superadmin"), {
      title: "Blog for SuperAdmin Delete",
      status: "published",
    });

    await setDoc(doc(db, "categories", "cat-target-update-editor"), {
      name: "Cat Update Editor",
      slug: "cat-up-ed",
    });
    await setDoc(doc(db, "categories", "cat-target-update-superadmin"), {
      name: "Cat Update SuperAdmin",
      slug: "cat-up-sa",
    });
    await setDoc(doc(db, "categories", "cat-target-delete-editor"), {
      name: "Cat Delete Editor",
      slug: "cat-del-ed",
    });
    await setDoc(doc(db, "categories", "cat-target-delete-superadmin"), {
      name: "Cat Delete SuperAdmin",
      slug: "cat-del-sa",
    });

    await setDoc(doc(db, "productUpdates", "update-target-delete-editor"), {
      title: "Update Delete Editor",
      status: "draft",
    });
    await setDoc(doc(db, "productUpdates", "update-target-delete-superadmin"), {
      title: "Update Delete SuperAdmin",
      status: "published",
    });

    await setDoc(doc(db, "pressReleases", "press-target-delete-editor"), {
      title: "Press Delete Editor",
      status: "draft",
    });
    await setDoc(doc(db, "pressReleases", "press-target-delete-superadmin"), {
      title: "Press Delete SuperAdmin",
      status: "published",
    });

    await setDoc(doc(db, "careers", "career-target-delete-editor"), {
      title: "Career Delete Editor",
      status: "closed",
    });
    await setDoc(doc(db, "careers", "career-target-delete-superadmin"), {
      title: "Career Delete SuperAdmin",
      status: "open",
    });

    await setDoc(doc(db, "media", "media-target-delete-editor"), {
      publicId: "media-del-ed",
      url: "https://example.com/1.jpg",
    });
    await setDoc(doc(db, "media", "media-target-delete-superadmin"), {
      publicId: "media-del-sa",
      url: "https://example.com/2.jpg",
    });

    await setDoc(doc(db, "contact_messages", "contact-target-delete-editor"), {
      fullName: "A",
      email: "a@a.com",
      phone: "+911234567890",
      subject: "S",
      message: "M123456789",
      consent: true,
    });
    await setDoc(
      doc(db, "contact_messages", "contact-target-delete-superadmin"),
      {
        fullName: "B",
        email: "b@b.com",
        phone: "+911234567890",
        subject: "S",
        message: "M123456789",
        consent: true,
      },
    );

    await setDoc(doc(db, "early_access_users", "early-target-delete-editor"), {
      fullName: "A",
      email: "a@a.com",
      phone: "+911234567890",
      occupation: "Dev",
      city: "BLR",
      consent: true,
    });
    await setDoc(
      doc(db, "early_access_users", "early-target-delete-superadmin"),
      {
        fullName: "B",
        email: "b@b.com",
        phone: "+911234567890",
        occupation: "Dev",
        city: "BLR",
        consent: true,
      },
    );

    await setDoc(
      doc(db, "newsletter_subscribers", "sub-target-delete-editor"),
      { email: "del-ed@example.com" },
    );
    await setDoc(
      doc(db, "newsletter_subscribers", "sub-target-delete-superadmin"),
      { email: "del-sa@example.com" },
    );

    await setDoc(doc(db, "career_applications", "app-target-delete-editor"), {
      fullName: "A",
      email: "a@a.com",
      phone: "+911234567890",
      position: "P",
      resumeLink: "https://r.com/1",
      status: "new",
      consent: true,
    });
    await setDoc(
      doc(db, "career_applications", "app-target-delete-superadmin"),
      {
        fullName: "B",
        email: "b@b.com",
        phone: "+911234567890",
        position: "P",
        resumeLink: "https://r.com/2",
        status: "new",
        consent: true,
      },
    );
  });

  // Client instances
  const anonDb = testEnv.unauthenticatedContext().firestore();
  const regularUserDb = testEnv
    .authenticatedContext("test-user-001")
    .firestore();
  const editorDb = testEnv.authenticatedContext("test-editor-001").firestore();
  const superAdminDb = testEnv
    .authenticatedContext("test-superadmin-001")
    .firestore();

  console.log("------------------------------------------------------------");
  console.log("1. ADMIN DOCUMENT SECURITY (IMMUTABILITY & PRIVILEGE)");
  console.log("------------------------------------------------------------");

  try {
    await assertFails(getDoc(doc(anonDb, "admins", "test-superadmin-001")));
    record(
      "Admin Document",
      "Anonymous read admin doc",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Anonymous read admin doc",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      setDoc(doc(anonDb, "admins", "test-anon-promoted"), {
        role: "super_admin",
      }),
    );
    record(
      "Admin Document",
      "Anonymous create admin doc",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Anonymous create admin doc",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(getDoc(doc(regularUserDb, "admins", "test-user-001")));
    record(
      "Admin Document",
      "Regular user read own admin path",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Regular user read own admin path",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      getDoc(doc(regularUserDb, "admins", "test-superadmin-001")),
    );
    record(
      "Admin Document",
      "Regular user read other admin doc",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Regular user read other admin doc",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      setDoc(doc(regularUserDb, "admins", "test-user-001"), {
        role: "super_admin",
        email: "user@example.com",
      }),
    );
    record(
      "Admin Document",
      "Regular user create admin doc (self-promote)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Regular user create admin doc (self-promote)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(getDoc(doc(editorDb, "admins", "test-editor-001")));
    record(
      "Admin Document",
      "Editor read own admin doc",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Editor read own admin doc",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(getDoc(doc(editorDb, "admins", "test-superadmin-001")));
    record(
      "Admin Document",
      "Editor read other admin doc",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Editor read other admin doc",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(editorDb, "admins", "test-editor-001"), {
        role: "super_admin",
      }),
    );
    record(
      "Admin Document",
      "Editor self-promotion to super_admin",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Editor self-promotion to super_admin",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(editorDb, "admins", "test-superadmin-001"), {
        role: "editor",
      }),
    );
    record(
      "Admin Document",
      "Editor modify other admin",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Editor modify other admin",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(deleteDoc(doc(editorDb, "admins", "test-editor-001")));
    record(
      "Admin Document",
      "Editor delete admin doc",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Editor delete admin doc",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      getDoc(doc(superAdminDb, "admins", "test-superadmin-001")),
    );
    record(
      "Admin Document",
      "Super Admin read own admin doc",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Super Admin read own admin doc",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      setDoc(doc(superAdminDb, "admins", "test-new-admin"), { role: "editor" }),
    );
    record(
      "Admin Document",
      "Super Admin client-side write (policy: allow write: if false)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Admin Document",
      "Super Admin client-side write (policy: allow write: if false)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("2. BLOGS RBAC & VISIBILITY");
  console.log("------------------------------------------------------------");

  try {
    await assertSucceeds(
      getDoc(doc(anonDb, "blogs", "blog-fixture-published")),
    );
    record(
      "Blogs",
      "Anonymous read published blog",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Blogs",
      "Anonymous read published blog",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(getDoc(doc(anonDb, "blogs", "blog-fixture-draft")));
    record("Blogs", "Anonymous read draft blog", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Blogs",
      "Anonymous read draft blog",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      setDoc(doc(anonDb, "blogs", "blog-anon-new"), {
        title: "Injected Blog",
        status: "published",
      }),
    );
    record("Blogs", "Anonymous create blog", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Blogs",
      "Anonymous create blog",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(getDoc(doc(editorDb, "blogs", "blog-fixture-draft")));
    record("Blogs", "Editor read draft blog", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Blogs",
      "Editor read draft blog",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      setDoc(doc(editorDb, "blogs", "blog-editor-create-target"), {
        title: "Editor Blog",
        status: "draft",
      }),
    );
    record("Blogs", "Editor create blog", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Blogs",
      "Editor create blog",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      updateDoc(doc(editorDb, "blogs", "blog-fixture-draft"), {
        title: "Updated Draft Title",
      }),
    );
    record("Blogs", "Editor update blog", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Blogs",
      "Editor update blog",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(editorDb, "blogs", "blog-target-delete-editor")),
    );
    record("Blogs", "Editor delete blog", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Blogs",
      "Editor delete blog",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(doc(superAdminDb, "blogs", "blog-target-delete-superadmin")),
    );
    record("Blogs", "Super Admin delete blog", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Blogs",
      "Super Admin delete blog",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("3. CATEGORIES RBAC");
  console.log("------------------------------------------------------------");

  try {
    await assertSucceeds(getDoc(doc(anonDb, "categories", "cat-fixture-tech")));
    record(
      "Categories",
      "Anonymous read categories",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Categories",
      "Anonymous read categories",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      setDoc(doc(anonDb, "categories", "cat-anon-create"), {
        name: "Anon Cat",
        slug: "anon",
      }),
    );
    record(
      "Categories",
      "Anonymous create category",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Categories",
      "Anonymous create category",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      setDoc(doc(editorDb, "categories", "cat-editor-new"), {
        name: "AI Tech",
        slug: "ai-tech",
      }),
    );
    record(
      "Categories",
      "Editor create category",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Categories",
      "Editor create category",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(editorDb, "categories", "cat-target-update-editor"), {
        name: "Hacked Cat",
      }),
    );
    record("Categories", "Editor update category", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Categories",
      "Editor update category",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(editorDb, "categories", "cat-target-delete-editor")),
    );
    record("Categories", "Editor delete category", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Categories",
      "Editor delete category",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      updateDoc(
        doc(superAdminDb, "categories", "cat-target-update-superadmin"),
        { name: "Admin Renamed Cat" },
      ),
    );
    record(
      "Categories",
      "Super Admin update category",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Categories",
      "Super Admin update category",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(superAdminDb, "categories", "cat-target-delete-superadmin"),
      ),
    );
    record(
      "Categories",
      "Super Admin delete category",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Categories",
      "Super Admin delete category",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("4. PRODUCT UPDATES RBAC & VISIBILITY");
  console.log("------------------------------------------------------------");

  try {
    await assertSucceeds(
      getDoc(doc(anonDb, "productUpdates", "update-fixture-published")),
    );
    record(
      "Product Updates",
      "Anonymous read published update",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Product Updates",
      "Anonymous read published update",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      getDoc(doc(anonDb, "productUpdates", "update-fixture-draft")),
    );
    record(
      "Product Updates",
      "Anonymous read draft update",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Product Updates",
      "Anonymous read draft update",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      setDoc(doc(editorDb, "productUpdates", "update-editor-create"), {
        title: "Editor Update",
        status: "draft",
      }),
    );
    record(
      "Product Updates",
      "Editor create update",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Product Updates",
      "Editor create update",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      updateDoc(doc(editorDb, "productUpdates", "update-fixture-draft"), {
        title: "Editor Mod Update",
      }),
    );
    record(
      "Product Updates",
      "Editor update update",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Product Updates",
      "Editor update update",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(editorDb, "productUpdates", "update-target-delete-editor")),
    );
    record(
      "Product Updates",
      "Editor delete update",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Product Updates",
      "Editor delete update",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(superAdminDb, "productUpdates", "update-target-delete-superadmin"),
      ),
    );
    record(
      "Product Updates",
      "Super Admin delete update",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Product Updates",
      "Super Admin delete update",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("5. PRESS RELEASES RBAC & VISIBILITY");
  console.log("------------------------------------------------------------");

  try {
    await assertSucceeds(
      getDoc(doc(anonDb, "pressReleases", "press-fixture-published")),
    );
    record(
      "Press Releases",
      "Anonymous read published press",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Press Releases",
      "Anonymous read published press",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      getDoc(doc(anonDb, "pressReleases", "press-fixture-draft")),
    );
    record(
      "Press Releases",
      "Anonymous read draft press",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Press Releases",
      "Anonymous read draft press",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      setDoc(doc(editorDb, "pressReleases", "press-editor-create"), {
        title: "Editor Press",
        status: "draft",
      }),
    );
    record(
      "Press Releases",
      "Editor create press release",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Press Releases",
      "Editor create press release",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      updateDoc(doc(editorDb, "pressReleases", "press-fixture-draft"), {
        title: "Editor Mod Press",
      }),
    );
    record(
      "Press Releases",
      "Editor update press release",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Press Releases",
      "Editor update press release",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(editorDb, "pressReleases", "press-target-delete-editor")),
    );
    record(
      "Press Releases",
      "Editor delete press release",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Press Releases",
      "Editor delete press release",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(superAdminDb, "pressReleases", "press-target-delete-superadmin"),
      ),
    );
    record(
      "Press Releases",
      "Super Admin delete press release",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Press Releases",
      "Super Admin delete press release",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("6. CAREERS RBAC & VISIBILITY");
  console.log("------------------------------------------------------------");

  try {
    await assertSucceeds(getDoc(doc(anonDb, "careers", "career-fixture-open")));
    record(
      "Careers",
      "Anonymous read open career",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Careers",
      "Anonymous read open career",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(getDoc(doc(anonDb, "careers", "career-fixture-closed")));
    record(
      "Careers",
      "Anonymous read closed career",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Careers",
      "Anonymous read closed career",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      getDoc(doc(editorDb, "careers", "career-fixture-closed")),
    );
    record(
      "Careers",
      "Editor read closed career",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Careers",
      "Editor read closed career",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      setDoc(doc(editorDb, "careers", "career-editor-create"), {
        title: "Editor Career",
        status: "open",
      }),
    );
    record("Careers", "Editor create career", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Careers",
      "Editor create career",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      updateDoc(doc(editorDb, "careers", "career-fixture-open"), {
        title: "Senior Frontend Engineer",
      }),
    );
    record("Careers", "Editor update career", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Careers",
      "Editor update career",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(editorDb, "careers", "career-target-delete-editor")),
    );
    record("Careers", "Editor delete career", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Careers",
      "Editor delete career",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(superAdminDb, "careers", "career-target-delete-superadmin"),
      ),
    );
    record(
      "Careers",
      "Super Admin delete career",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Careers",
      "Super Admin delete career",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("7. WEBSITE SETTINGS RBAC");
  console.log("------------------------------------------------------------");

  try {
    await assertSucceeds(getDoc(doc(anonDb, "websiteSettings", "general")));
    record(
      "Website Settings",
      "Anonymous read settings",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Website Settings",
      "Anonymous read settings",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(anonDb, "websiteSettings", "general"), {
        siteName: "Defaced",
      }),
    );
    record(
      "Website Settings",
      "Anonymous write settings",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Website Settings",
      "Anonymous write settings",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(getDoc(doc(editorDb, "websiteSettings", "general")));
    record(
      "Website Settings",
      "Editor read settings",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Website Settings",
      "Editor read settings",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(editorDb, "websiteSettings", "general"), {
        siteName: "Editor Defaced",
      }),
    );
    record(
      "Website Settings",
      "Editor write settings",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Website Settings",
      "Editor write settings",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      updateDoc(doc(superAdminDb, "websiteSettings", "general"), {
        siteName: "Vednix Tech Pvt Ltd",
      }),
    );
    record(
      "Website Settings",
      "Super Admin write settings",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Website Settings",
      "Super Admin write settings",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("8. MEDIA COLLECTION RBAC");
  console.log("------------------------------------------------------------");

  try {
    await assertFails(getDoc(doc(anonDb, "media", "media-fixture-001")));
    record("Media", "Anonymous read media", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Media",
      "Anonymous read media",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(getDoc(doc(editorDb, "media", "media-fixture-001")));
    record("Media", "Editor read media", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Media",
      "Editor read media",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      setDoc(doc(editorDb, "media", "media-editor-create"), {
        publicId: "v/1",
        url: "https://r.com/1.jpg",
      }),
    );
    record("Media", "Editor create media record", "ALLOWED", "ALLOWED", "PASS");
  } catch (err: any) {
    record(
      "Media",
      "Editor create media record",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      updateDoc(doc(editorDb, "media", "media-fixture-001"), { width: 1920 }),
    );
    record(
      "Media",
      "Editor update media metadata",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Media",
      "Editor update media metadata",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(editorDb, "media", "media-target-delete-editor")),
    );
    record("Media", "Editor delete media record", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Media",
      "Editor delete media record",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(doc(superAdminDb, "media", "media-target-delete-superadmin")),
    );
    record(
      "Media",
      "Super Admin delete media record",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Media",
      "Super Admin delete media record",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("9. ACTIVITY AUDIT LOGS (IMMUTABILITY & AUDIT TRAIL)");
  console.log("------------------------------------------------------------");

  try {
    await assertFails(getDoc(doc(anonDb, "activityLogs", "log-fixture-001")));
    record("Activity Logs", "Anonymous read logs", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Activity Logs",
      "Anonymous read logs",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "activityLogs"), {
        action: "hack",
        summary: "anon log",
      }),
    );
    record("Activity Logs", "Anonymous create log", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Activity Logs",
      "Anonymous create log",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(getDoc(doc(editorDb, "activityLogs", "log-fixture-001")));
    record("Activity Logs", "Editor read logs", "DENIED", "DENIED", "PASS");
  } catch (err: any) {
    record(
      "Activity Logs",
      "Editor read logs",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      getDoc(doc(superAdminDb, "activityLogs", "log-fixture-001")),
    );
    record(
      "Activity Logs",
      "Super Admin read logs",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Activity Logs",
      "Super Admin read logs",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      addDoc(collection(editorDb, "activityLogs"), {
        action: "blog.created",
        summary: "Editor logged action",
        actorEmail: "editor@vednix.com",
      }),
    );
    record(
      "Activity Logs",
      "Editor append log entry",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Activity Logs",
      "Editor append log entry",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      addDoc(collection(superAdminDb, "activityLogs"), {
        action: "settings.updated",
        summary: "SuperAdmin logged action",
        actorEmail: "admin@vednix.com",
      }),
    );
    record(
      "Activity Logs",
      "Super Admin append log entry",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Activity Logs",
      "Super Admin append log entry",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(editorDb, "activityLogs", "log-fixture-001"), {
        summary: "Tampered by editor",
      }),
    );
    record(
      "Activity Logs",
      "Editor modify log (Immutability)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Activity Logs",
      "Editor modify log (Immutability)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(superAdminDb, "activityLogs", "log-fixture-001"), {
        summary: "Tampered by superadmin",
      }),
    );
    record(
      "Activity Logs",
      "Super Admin modify log (Immutability)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Activity Logs",
      "Super Admin modify log (Immutability)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(editorDb, "activityLogs", "log-fixture-001")),
    );
    record(
      "Activity Logs",
      "Editor delete log (Immutability)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Activity Logs",
      "Editor delete log (Immutability)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(superAdminDb, "activityLogs", "log-fixture-001")),
    );
    record(
      "Activity Logs",
      "Super Admin delete log (Immutability)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Activity Logs",
      "Super Admin delete log (Immutability)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log(
    "10. PUBLIC FORMS SCHEMA WHITELISTS & ACCESS (ALL 4 COLLECTIONS)",
  );
  console.log("------------------------------------------------------------");

  // Collection 1: contact_messages
  try {
    await assertSucceeds(
      addDoc(collection(anonDb, "contact_messages"), {
        fullName: "Public Visitor",
        email: "visitor@example.com",
        phone: "+919876543210",
        subject: "Question",
        message: "Legitimate contact message.",
        consent: true,
      }),
    );
    record(
      "Public Forms",
      "contact_messages valid exact schema",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages valid exact schema",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "contact_messages"), {
        fullName: "Visitor",
        email: "v@v.com",
        phone: "+919876543210",
        subject: "Q",
        message: "Missing consent flag.",
      }),
    );
    record(
      "Public Forms",
      "contact_messages missing required field (consent)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages missing required field (consent)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "contact_messages"), {
        fullName: "Visitor",
        email: "v@v.com",
        phone: "+919876543210",
        subject: "Q",
        message: "Valid message text.",
        consent: true,
        extraField: "unexpected",
      }),
    );
    record(
      "Public Forms",
      "contact_messages one unexpected field",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages one unexpected field",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "contact_messages"), {
        fullName: "Visitor",
        email: "v@v.com",
        phone: "+919876543210",
        subject: "Q",
        message: "Valid message text.",
        consent: true,
        extra1: 1,
        extra2: 2,
      }),
    );
    record(
      "Public Forms",
      "contact_messages multiple unexpected fields",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages multiple unexpected fields",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "contact_messages"), {
        fullName: "Visitor",
        email: "v@v.com",
        phone: "+919876543210",
        subject: "Q",
        message: "Valid message text.",
        consent: true,
        role: "super_admin",
        isAdmin: true,
      }),
    );
    record(
      "Public Forms",
      "contact_messages privileged field injection",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages privileged field injection",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      getDoc(doc(anonDb, "contact_messages", "contact-fixture-001")),
    );
    record(
      "Public Forms",
      "contact_messages anonymous read",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages anonymous read",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      updateDoc(doc(anonDb, "contact_messages", "contact-fixture-001"), {
        subject: "Altered",
      }),
    );
    record(
      "Public Forms",
      "contact_messages anonymous update",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages anonymous update",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(doc(anonDb, "contact_messages", "contact-fixture-001")),
    );
    record(
      "Public Forms",
      "contact_messages anonymous delete",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages anonymous delete",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      getDoc(doc(editorDb, "contact_messages", "contact-fixture-001")),
    );
    record(
      "Public Forms",
      "contact_messages editor read",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages editor read",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(
        doc(editorDb, "contact_messages", "contact-target-delete-editor"),
      ),
    );
    record(
      "Public Forms",
      "contact_messages editor delete",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages editor delete",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(
          superAdminDb,
          "contact_messages",
          "contact-target-delete-superadmin",
        ),
      ),
    );
    record(
      "Public Forms",
      "contact_messages super_admin delete",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "contact_messages super_admin delete",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  // Collection 2: early_access_users
  try {
    await assertSucceeds(
      addDoc(collection(anonDb, "early_access_users"), {
        fullName: "Beta Tester",
        email: "tester@example.com",
        phone: "+919876543210",
        occupation: "Dev",
        city: "BLR",
        consent: true,
      }),
    );
    record(
      "Public Forms",
      "early_access_users valid exact schema",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "early_access_users valid exact schema",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "early_access_users"), {
        fullName: "Tester",
        email: "t@t.com",
        phone: "+919876543210",
        occupation: "Dev",
        city: "BLR",
        consent: true,
        unexpectedKey: "xyz",
      }),
    );
    record(
      "Public Forms",
      "early_access_users one unexpected field",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "early_access_users one unexpected field",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "early_access_users"), {
        fullName: "Tester",
        email: "t@t.com",
        phone: "+919876543210",
        occupation: "Dev",
        city: "BLR",
        consent: true,
        u1: 1,
        u2: 2,
      }),
    );
    record(
      "Public Forms",
      "early_access_users multiple unexpected fields",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "early_access_users multiple unexpected fields",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "early_access_users"), {
        fullName: "Tester",
        email: "t@t.com",
        phone: "+919876543210",
        occupation: "Dev",
        city: "BLR",
        consent: true,
        role: "editor",
        isAdmin: true,
      }),
    );
    record(
      "Public Forms",
      "early_access_users privileged field injection",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "early_access_users privileged field injection",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      getDoc(doc(anonDb, "early_access_users", "early-fixture-001")),
    );
    record(
      "Public Forms",
      "early_access_users anonymous read",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "early_access_users anonymous read",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(
        doc(editorDb, "early_access_users", "early-target-delete-editor"),
      ),
    );
    record(
      "Public Forms",
      "early_access_users editor delete",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "early_access_users editor delete",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(
          superAdminDb,
          "early_access_users",
          "early-target-delete-superadmin",
        ),
      ),
    );
    record(
      "Public Forms",
      "early_access_users super_admin delete",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "early_access_users super_admin delete",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  // Collection 3: newsletter_subscribers
  try {
    await assertSucceeds(
      addDoc(collection(anonDb, "newsletter_subscribers"), {
        email: "subscriber@example.com",
        source: "footer",
      }),
    );
    record(
      "Public Forms",
      "newsletter_subscribers valid exact schema",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "newsletter_subscribers valid exact schema",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "newsletter_subscribers"), {
        email: "sub@s.com",
        extra: "forbidden",
      }),
    );
    record(
      "Public Forms",
      "newsletter_subscribers unexpected field",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "newsletter_subscribers unexpected field",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "newsletter_subscribers"), {
        email: "sub@s.com",
        role: "super_admin",
      }),
    );
    record(
      "Public Forms",
      "newsletter_subscribers privileged field injection",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "newsletter_subscribers privileged field injection",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      getDoc(doc(anonDb, "newsletter_subscribers", "sub-fixture-001")),
    );
    record(
      "Public Forms",
      "newsletter_subscribers anonymous read",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "newsletter_subscribers anonymous read",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(
        doc(editorDb, "newsletter_subscribers", "sub-target-delete-editor"),
      ),
    );
    record(
      "Public Forms",
      "newsletter_subscribers editor delete",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "newsletter_subscribers editor delete",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(
          superAdminDb,
          "newsletter_subscribers",
          "sub-target-delete-superadmin",
        ),
      ),
    );
    record(
      "Public Forms",
      "newsletter_subscribers super_admin delete",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "newsletter_subscribers super_admin delete",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  // Collection 4: career_applications
  try {
    await assertSucceeds(
      addDoc(collection(anonDb, "career_applications"), {
        fullName: "Engineer Applicant",
        email: "engineer@example.com",
        phone: "+919876543210",
        position: "Fullstack",
        resumeLink: "https://drive.google.com/resume.pdf",
        status: "new",
        consent: true,
      }),
    );
    record(
      "Public Forms",
      "career_applications valid exact schema (status='new')",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "career_applications valid exact schema (status='new')",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "career_applications"), {
        fullName: "Applicant",
        email: "app@a.com",
        phone: "+919876543210",
        position: "Dev",
        resumeLink: "https://r.com/1",
        status: "hired",
        consent: true,
      }),
    );
    record(
      "Public Forms",
      "career_applications privileged status manipulation ('hired')",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "career_applications privileged status manipulation ('hired')",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "career_applications"), {
        fullName: "Applicant",
        email: "app@a.com",
        phone: "+919876543210",
        position: "Dev",
        resumeLink: "https://r.com/1",
        status: "new",
        consent: true,
        unexpectedKey: "test",
      }),
    );
    record(
      "Public Forms",
      "career_applications one unexpected field",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "career_applications one unexpected field",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      addDoc(collection(anonDb, "career_applications"), {
        fullName: "Applicant",
        email: "app@a.com",
        phone: "+919876543210",
        position: "Dev",
        resumeLink: "https://r.com/1",
        status: "new",
        consent: true,
        role: "super_admin",
      }),
    );
    record(
      "Public Forms",
      "career_applications privileged field injection (role)",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "career_applications privileged field injection (role)",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      getDoc(doc(anonDb, "career_applications", "app-fixture-001")),
    );
    record(
      "Public Forms",
      "career_applications anonymous read",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "career_applications anonymous read",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertFails(
      deleteDoc(
        doc(editorDb, "career_applications", "app-target-delete-editor"),
      ),
    );
    record(
      "Public Forms",
      "career_applications editor delete",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "career_applications editor delete",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  try {
    await assertSucceeds(
      deleteDoc(
        doc(
          superAdminDb,
          "career_applications",
          "app-target-delete-superadmin",
        ),
      ),
    );
    record(
      "Public Forms",
      "career_applications super_admin delete",
      "ALLOWED",
      "ALLOWED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Public Forms",
      "career_applications super_admin delete",
      "ALLOWED",
      "DENIED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("11. BATCH WRITES & MULTI-DOCUMENT ESCALATION PROTECTION");
  console.log("------------------------------------------------------------");

  // Batch escalation 1: Editor combines permitted blog create with forbidden blog delete
  try {
    const batch = writeBatch(editorDb);
    batch.set(doc(editorDb, "blogs", "blog-batch-editor-allowed"), {
      title: "Allowed Blog",
      status: "draft",
    });
    batch.delete(doc(editorDb, "blogs", "blog-fixture-published")); // Forbidden for editor
    await assertFails(batch.commit());
    record(
      "Batch Escalation",
      "Editor batch: permitted create + forbidden delete fails atomicity",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Batch Escalation",
      "Editor batch: permitted create + forbidden delete fails atomicity",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  // Batch escalation 2: Editor combines permitted blog create with forbidden admin self-promotion
  try {
    const batch = writeBatch(editorDb);
    batch.set(doc(editorDb, "blogs", "blog-batch-editor-allowed-2"), {
      title: "Allowed Blog 2",
      status: "draft",
    });
    batch.update(doc(editorDb, "admins", "test-editor-001"), {
      role: "super_admin",
    }); // Forbidden for editor
    await assertFails(batch.commit());
    record(
      "Batch Escalation",
      "Editor batch: permitted blog create + forbidden admin self-promote",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Batch Escalation",
      "Editor batch: permitted blog create + forbidden admin self-promote",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  // Batch escalation 3: Anonymous combines permitted contact submission with forbidden settings overwrite
  try {
    const batch = writeBatch(anonDb);
    batch.set(doc(collection(anonDb, "contact_messages")), {
      fullName: "Visitor",
      email: "v@v.com",
      phone: "+919876543210",
      subject: "S",
      message: "Message12345",
      consent: true,
    });
    batch.update(doc(anonDb, "websiteSettings", "general"), {
      siteName: "Defaced",
    }); // Forbidden for anonymous
    await assertFails(batch.commit());
    record(
      "Batch Escalation",
      "Anonymous batch: valid contact submit + forbidden settings overwrite",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Batch Escalation",
      "Anonymous batch: valid contact submit + forbidden settings overwrite",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  // Multi-document write: Super admin permitted settings write combined with forbidden activityLog update
  try {
    const batch = writeBatch(superAdminDb);
    batch.update(doc(superAdminDb, "websiteSettings", "general"), {
      siteName: "Legit Change",
    });
    batch.update(doc(superAdminDb, "activityLogs", "log-fixture-001"), {
      summary: "Tampered Entry",
    }); // Forbidden for everyone
    await assertFails(batch.commit());
    record(
      "Batch Escalation",
      "Multi-doc batch: super_admin settings write + forbidden log update",
      "DENIED",
      "DENIED",
      "PASS",
    );
  } catch (err: any) {
    record(
      "Batch Escalation",
      "Multi-doc batch: super_admin settings write + forbidden log update",
      "DENIED",
      "ALLOWED",
      "FAIL",
      err.message,
    );
  }

  console.log("\n------------------------------------------------------------");
  console.log("12. MALFORMED ROLES & FAIL-CLOSED AUTHORIZATION REGRESSION");
  console.log("------------------------------------------------------------");

  const malformedTestCases = [
    { name: "missing role field", id: "test-missing-role-001" },
    { name: "null role", id: "test-null-role-001" },
    { name: "empty role string", id: "test-empty-role-001" },
    { name: "role: 'admin'", id: "test-admin-role-001" },
    { name: "role: 'superadmin'", id: "test-superadmin-word-001" },
    { name: "role: 'super-admin'", id: "test-hyphen-role-001" },
    { name: "role: 'owner'", id: "test-owner-role-001" },
    { name: "role: 'administrator'", id: "test-administrator-role-001" },
    { name: "role: 'root'", id: "test-root-role-001" },
    { name: "role: 'custom_unknown'", id: "test-unknown-role-001" },
  ];

  for (const tc of malformedTestCases) {
    const clientDb = testEnv.authenticatedContext(tc.id).firestore();

    // 1. Must fail closed on blog delete
    try {
      await assertFails(
        deleteDoc(doc(clientDb, "blogs", "blog-fixture-published")),
      );
      record(
        "Malformed Roles",
        `${tc.name} fails closed on blog delete`,
        "DENIED",
        "DENIED",
        "PASS",
      );
    } catch (err: any) {
      record(
        "Malformed Roles",
        `${tc.name} fails closed on blog delete`,
        "DENIED",
        "ALLOWED",
        "FAIL",
        err.message,
      );
    }

    // 2. Must fail closed on settings write
    try {
      await assertFails(
        updateDoc(doc(clientDb, "websiteSettings", "general"), {
          siteName: "Hacked",
        }),
      );
      record(
        "Malformed Roles",
        `${tc.name} fails closed on settings write`,
        "DENIED",
        "DENIED",
        "PASS",
      );
    } catch (err: any) {
      record(
        "Malformed Roles",
        `${tc.name} fails closed on settings write`,
        "DENIED",
        "ALLOWED",
        "FAIL",
        err.message,
      );
    }

    // 3. Must fail closed on reading private activity logs
    try {
      await assertFails(
        getDoc(doc(clientDb, "activityLogs", "log-fixture-001")),
      );
      record(
        "Malformed Roles",
        `${tc.name} fails closed on read activity logs`,
        "DENIED",
        "DENIED",
        "PASS",
      );
    } catch (err: any) {
      record(
        "Malformed Roles",
        `${tc.name} fails closed on read activity logs`,
        "DENIED",
        "ALLOWED",
        "FAIL",
        err.message,
      );
    }
  }

  // Cleanup test environment
  await testEnv.cleanup();

  console.log("\n============================================================");
  console.log("HARDENED REGRESSION SUITE RUN COMPLETE");
  console.log("============================================================");

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`Total Security Tests Run: ${results.length}`);
  console.log(`Passed:                  ${passed}`);
  console.log(`Failed:                  ${failed}`);
  console.log("============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runHardenedTestSuite().catch((err) => {
  console.error("FATAL SUITE EXECUTION ERROR:", err);
  process.exit(1);
});
