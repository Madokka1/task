@@ .. @@
             </nav>

-            <div className="absolute bottom-4 left-4 right-4">
-              <button onClick={onLogout} className="btn-secondary w-full">
-                <div className="icon-log-out text-sm mr-2"></div>
-                Выйти
-              </button>
-            </div>
           </div>

           {/* Main content */}
-          <div className="flex-1 p-8">
+          <div className="flex-1 p-8 pb-20">
             {renderContent()}
+            
+            {/* Logout button moved to bottom */}
+            <div className="fixed bottom-4 right-8">
+              <button onClick={onLogout} className="btn-secondary shadow-lg">
+                <div className="icon-log-out text-sm mr-2"></div>
+                Выйти
+              </button>
+            </div>
           </div>
         </div>
       </div>