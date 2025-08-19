#!/bin/bash

echo "Fixing TypeScript and ESLint errors..."

# Fix unused imports in components
echo "Fixing unused imports..."

# AppSidebar.tsx - already fixed React, now fix others
sed -i '/import { Badge } from .\/ui\/badge/d' /workspace/src/components/AppSidebar.tsx
sed -i '/import { cn } from .\.\/lib\/utils/d' /workspace/src/components/AppSidebar.tsx
sed -i 's/const activeMainItem = getActiveMainItem()/\/\/ const activeMainItem = getActiveMainItem()/' /workspace/src/components/AppSidebar.tsx

# CRMAnalytics.tsx
sed -i 's/import React, { useState, useEffect }/import { useState }/' /workspace/src/components/CRMAnalytics.tsx
sed -i '/import { Input } from/d' /workspace/src/components/CRMAnalytics.tsx
sed -i '/import { cn } from/d' /workspace/src/components/CRMAnalytics.tsx
sed -i '/import { format } from/d' /workspace/src/components/CRMAnalytics.tsx
sed -i 's/, CalendarIcon,/,/' /workspace/src/components/CRMAnalytics.tsx
sed -i 's/, TargetIcon,/,/' /workspace/src/components/CRMAnalytics.tsx

# ErrorFallback.tsx
sed -i 's/import React from .react.//' /workspace/src/components/ErrorFallback.tsx

# HeaderActions.tsx  
sed -i 's/import React from .react.//' /workspace/src/components/HeaderActions.tsx
sed -i '/Command,/d' /workspace/src/components/HeaderActions.tsx
sed -i '/import { cn } from/d' /workspace/src/components/HeaderActions.tsx

# Sidebar.tsx
sed -i 's/, Link,/,/' /workspace/src/components/Sidebar.tsx
sed -i 's/, Search,/,/' /workspace/src/components/Sidebar.tsx
sed -i 's/, Sun,/,/' /workspace/src/components/Sidebar.tsx
sed -i 's/, Keyboard,/,/' /workspace/src/components/Sidebar.tsx
sed -i 's/, Plus//' /workspace/src/components/Sidebar.tsx

# Budget components
sed -i 's/import React, { useState, useEffect }/import { useState }/' /workspace/src/components/budget/BudgetApprovalProcess.tsx
sed -i 's/, User,/,/' /workspace/src/components/budget/BudgetApprovalProcess.tsx
sed -i 's/, Eye//' /workspace/src/components/budget/BudgetApprovalProcess.tsx

sed -i 's/import React from .react.//' /workspace/src/components/budget/BudgetComparisonView.tsx
sed -i 's/import React from .react.//' /workspace/src/components/budget/BudgetCreateDialog.tsx
sed -i 's/import React from .react.//' /workspace/src/components/budget/BudgetEditDialog.tsx
sed -i 's/import React from .react.//' /workspace/src/components/budget/BudgetManagement.tsx

# Fix missing lucide-react icons
echo "Adding missing lucide-react icons..."
sed -i 's/AlertCircle/AlertCircle, CheckCircle, Gift, Send, Globe, Heart, Activity, Star, MoreHorizontal/' /workspace/src/pages/crm/CRMManagement.tsx
sed -i 's/} from .lucide-react./&\nimport { Stop } from "lucide-react"/' /workspace/src/pages/crm/CampaignManagement.tsx

# Fix API middleware any types
echo "Fixing API middleware types..."
sed -i 's/: any/: unknown/g' /workspace/api/middleware/audit.ts
sed -i 's/: any/: unknown/g' /workspace/api/middleware/errorHandler.ts
sed -i 's/: any/: unknown/g' /workspace/api/middleware/security.ts
sed -i 's/: any/: unknown/g' /workspace/api/middleware/validation.ts

# Fix prefer-const errors
sed -i 's/let statusCode =/const statusCode =/' /workspace/api/middleware/errorHandler.ts
sed -i 's/let message =/const message =/' /workspace/api/middleware/errorHandler.ts
sed -i 's/let code =/const code =/' /workspace/api/middleware/errorHandler.ts
sed -i 's/let messageData =/const messageData =/' /workspace/api/routes/whatsapp.ts

# Fix no-useless-escape
sed -i 's/\\!/!/g' /workspace/api/middleware/security.ts

# Fix unused variables
sed -i 's/const DOMPurifyInstance/\/\/ const DOMPurifyInstance/' /workspace/api/middleware/audit.ts
sed -i 's/const hashContent/\/\/ const hashContent/' /workspace/api/middleware/audit.ts
sed -i 's/const responseData/\/\/ const responseData/' /workspace/api/middleware/audit.ts

echo "Fixing complete! Running type-check and lint to verify..."